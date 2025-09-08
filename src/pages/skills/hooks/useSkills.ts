import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import type { SkillCategory, Skill, Subskill, UserSkill, EmployeeRating } from "@/types/database";

export const useSkills = () => {
  const [skillCategories, setSkillCategories] = useState<SkillCategory[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [subskills, setSubskills] = useState<Subskill[]>([]);
  const [userSkills, setUserSkills] = useState<EmployeeRating[]>([]);
  const [pendingRatings, setPendingRatings] = useState<Map<string, { type: 'skill' | 'subskill', id: string, rating: 'high' | 'medium' | 'low' }>>(new Map());
  const [loading, setLoading] = useState(true);
  
  const { profile } = useAuth();
  const { toast } = useToast();

  const fetchData = async () => {
    if (!profile) return;
    
    try {
      setLoading(true);
      console.log('🔍 Fetching data for user:', profile.user_id);

      // Fetch skill categories
      const { data: categoriesData } = await supabase
        .from('skill_categories')
        .select('*')
        .order('name');

      // Fetch skills
      const { data: skillsData } = await supabase
        .from('skills')
        .select('*')
        .order('name');

      // Fetch subskills
      const { data: subskillsData } = await supabase
        .from('subskills' as any)
        .select('*')
        .order('name');

      // Fetch employee ratings for current user with manual joins
      let userSkillsData: any[] = [];
      if (profile.user_id) {
        console.log('📊 Fetching employee ratings...');
        
        // First get the ratings
        const { data: ratingsData, error: ratingsError } = await supabase
          .from('employee_ratings')
          .select('*')
          .eq('user_id', profile.user_id);
        
        console.log('📊 Raw ratings result:', { data: ratingsData, error: ratingsError, count: ratingsData?.length });

        if (ratingsData && ratingsData.length > 0) {
          // Get related skills and profiles
          const skillIds = [...new Set(ratingsData.map(r => r.skill_id))];
          const subskillIds = [...new Set(ratingsData.map(r => r.subskill_id).filter(Boolean))];
          const approverIds = [...new Set(ratingsData.map(r => r.approved_by).filter(Boolean))];

          // Fetch related data
          const [skillsResult, subskillsResult, profilesResult] = await Promise.all([
            supabase.from('skills').select('*').in('id', skillIds),
            subskillIds.length > 0 ? supabase.from('subskills').select('*').in('id', subskillIds) : Promise.resolve({ data: [] }),
            approverIds.length > 0 ? supabase.from('profiles').select('*').in('user_id', approverIds) : Promise.resolve({ data: [] })
          ]);

          // Manually join the data
          userSkillsData = ratingsData.map(rating => ({
            ...rating,
            skill: skillsResult.data?.find(s => s.id === rating.skill_id),
            subskill: rating.subskill_id ? subskillsResult.data?.find(s => s.id === rating.subskill_id) : null,
            approver: rating.approved_by ? profilesResult.data?.find(p => p.user_id === rating.approved_by) : null
          }));
        }
      }

      setSkillCategories(categoriesData || []);
      setSkills(skillsData || []);
      setSubskills(subskillsData as unknown as Subskill[] || []);
      setUserSkills(userSkillsData as EmployeeRating[]);
      console.log('📋 State updated - userSkills count:', userSkillsData.length);
    } catch (error) {
      console.error('❌ Error fetching skills data:', error);
      toast({
        title: "Error",
        description: "Failed to load skills data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [profile]);

  const handleSkillRate = (skillId: string, rating: 'high' | 'medium' | 'low') => {
    if (!profile?.user_id) return;
    
    setPendingRatings(prev => {
      const newRatings = new Map(prev);
      newRatings.set(skillId, { type: 'skill', id: skillId, rating });
      return newRatings;
    });
  };

  const handleSubskillRate = (subskillId: string, rating: 'high' | 'medium' | 'low') => {
    if (!profile?.user_id) return;
    
    setPendingRatings(prev => {
      const newRatings = new Map(prev);
      newRatings.set(subskillId, { type: 'subskill', id: subskillId, rating });
      return newRatings;
    });
  };

  const handleSaveRatings = async () => {
    if (!profile?.user_id || pendingRatings.size === 0) return;

    try {
      const ratingsToSave = Array.from(pendingRatings.values());
      console.log('🔄 Saving ratings:', ratingsToSave);
      console.log('👤 User ID:', profile.user_id);
      
      // Prepare data for UPSERT
      const ratingsData = ratingsToSave.map(rating => {
        if (rating.type === 'skill') {
          return {
            user_id: profile.user_id,
            skill_id: rating.id,
            subskill_id: null,
            rating: rating.rating,
            status: 'submitted' as const,
            submitted_at: new Date().toISOString()
          };
        } else {
          // Handle subskill rating
          const subskill = subskills.find(s => s.id === rating.id);
          if (!subskill) return null;

          return {
            user_id: profile.user_id,
            skill_id: subskill.skill_id,
            subskill_id: rating.id,
            rating: rating.rating,
            status: 'submitted' as const,
            submitted_at: new Date().toISOString()
          };
        }
      }).filter(Boolean);

      console.log('💾 Data to save:', ratingsData);

      // Use UPSERT to handle both insert and update
      const { data, error } = await supabase
        .from('employee_ratings')
        .upsert(ratingsData, {
          onConflict: 'user_id,skill_id,subskill_id',
          ignoreDuplicates: false
        })
        .select();

      console.log('✅ Upsert result:', { data, error });

      if (error) throw error;

      // Send notification to tech lead if user has one
      if (profile.tech_lead_id && ratingsToSave.length > 0) {
        console.log('📨 Sending notification to tech lead:', profile.tech_lead_id);
        
        const { error: notificationError } = await supabase
          .from('notifications')
          .insert({
            user_id: profile.tech_lead_id,
            title: 'New Skill Ratings Submitted',
            message: `${profile.full_name} has submitted ${ratingsToSave.length} skill rating${ratingsToSave.length > 1 ? 's' : ''} for your review.`,
            type: 'info'
          });

        if (notificationError) {
          console.error('❌ Error creating notification:', notificationError);
        } else {
          console.log('✅ Notification sent successfully');
        }
      }

      toast({
        title: "✅ Ratings submitted successfully",
        description: `${ratingsToSave.length} rating${ratingsToSave.length > 1 ? 's' : ''} submitted for approval`,
      });

      setPendingRatings(new Map());
      await fetchData();
    } catch (error) {
      console.error('❌ Error saving ratings:', error);
      toast({
        title: "Error",
        description: "Failed to submit ratings",
        variant: "destructive",
      });
    }
  };

  return {
    skillCategories,
    skills,
    subskills,
    userSkills,
    pendingRatings,
    loading,
    fetchData,
    handleSkillRate,
    handleSubskillRate,
    handleSaveRatings,
    setPendingRatings
  };
};