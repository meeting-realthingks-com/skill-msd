import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Edit, Trash2, TrendingUp, Users, Target, X, Settings } from "lucide-react";
import { AddCategoryModal } from "./admin/AddCategoryModal";
import { ApprovedRatingsModal } from "./ApprovedRatingsModal";
import { PendingRatingsModal } from "./PendingRatingsModal";
import { RejectedRatingsModal } from "./RejectedRatingsModal";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { SkillsService } from "../services/skills.service";
import { calculateCategoryProgress } from "../utils/skillHelpers";
import type { SkillCategory, EmployeeRating, Skill } from "@/types/database";

interface CategoryCardProps {
  category: SkillCategory;
  skillCount: number;
  isManagerOrAbove: boolean;
  onClick: () => void;
  onRefresh: () => void;
  index: number;
  userSkills?: EmployeeRating[];
  skills?: Skill[];
  subskills?: any[];
  showHideButton?: boolean;
  onHide?: (categoryId: string, categoryName: string) => void;
}

export const CategoryCard = ({
  category,
  skillCount,
  isManagerOrAbove,
  onClick,
  onRefresh,
  index,
  userSkills = [],
  skills = [],
  subskills = [],
  showHideButton = false,
  onHide
}: CategoryCardProps) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showApprovedModal, setShowApprovedModal] = useState(false);
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [showRejectedModal, setShowRejectedModal] = useState(false);
  const [selectedRatingFilter, setSelectedRatingFilter] = useState<'high' | 'medium' | 'low' | undefined>();
  const { toast } = useToast();

  // Calculate user-specific statistics using new progress rules
  const progressData = React.useMemo(() => {
    return calculateCategoryProgress(category.id, skills, subskills, userSkills);
  }, [category.id, skills, subskills, userSkills]);

  const { 
    totalItems, 
    ratedItems, 
    progressPercentage, 
    ratingCounts, 
    approvedCount, 
    pendingCount,
    rejectedCount 
  } = progressData;

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowEditModal(true);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Delete button clicked for category:', category.name, category.id);
    
    if (!confirm(`Are you sure you want to delete "${category.name}"? This will also delete all associated skills and ratings.`)) {
      console.log('Delete cancelled by user');
      return;
    }

    try {
      console.log('Attempting to delete category:', category.id);
      
      // Enhanced logging to debug the deletion process
      const { data: userRole } = await supabase.rpc('get_current_user_role');
      console.log('Current user role:', userRole);
      
      await SkillsService.deleteCategory(category.id);

      console.log('Category deleted successfully');
      toast({
        title: "Category Deleted",
        description: `"${category.name}" has been deleted successfully.`,
      });
      onRefresh();
    } catch (error) {
      console.error('Error deleting category:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      toast({
        title: "Error",
        description: `Failed to delete category: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    }
  };

  const handleRatingClick = (rating: 'high' | 'medium' | 'low', e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedRatingFilter(rating);
    setShowApprovedModal(true);
  };

  const handleApprovedClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedRatingFilter(undefined);
    setShowApprovedModal(true);
  };

  const handleRejectedClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowRejectedModal(true);
  };

  const handlePendingClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowPendingModal(true);
  };

  const handleUpdateClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClick();
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ 
          duration: 0.2, 
          delay: Math.min(index * 0.05, 0.3),
          ease: "easeOut" 
        }}
        whileHover={{ 
          y: -8,
          transition: { duration: 0.2 }
        }}
        className="group"
      >
        <Card 
          className="relative h-full w-full border border-border/20 bg-gradient-to-br from-card to-muted/20 hover:shadow-lg transition-all duration-300 overflow-hidden rounded-xl"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Action Buttons */}
          <div 
            className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Hide Category Button for Employee/Tech Lead */}
            {showHideButton && onHide && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onHide(category.id, category.name);
                }}
                className="h-8 w-8 p-0 bg-background/80 backdrop-blur-sm hover:bg-destructive/10 text-destructive border border-border/50"
                aria-label={`Hide ${category.name}`}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
            
            {/* Admin Actions */}
            {isManagerOrAbove && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleEdit(e);
                  }}
                  className="h-8 w-8 p-0 bg-background/80 backdrop-blur-sm hover:bg-primary/10 border border-border/50"
                  aria-label={`Edit ${category.name}`}
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDelete(e);
                  }}
                  className="h-8 w-8 p-0 bg-background/80 backdrop-blur-sm hover:bg-destructive/10 text-destructive border border-border/50"
                  aria-label={`Delete ${category.name}`}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </>
            )}
          </div>

          <CardHeader className="pb-2 px-4 pt-4">
            <div className="space-y-1">
              <motion.h3 
                className="text-2xl font-bold text-foreground line-clamp-2 leading-tight"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                {category.name}
              </motion.h3>
              
              {category.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                  {category.description}
                </p>
              )}
            </div>
          </CardHeader>

          <CardContent className="pt-0 px-4 pb-4 relative z-10 flex flex-col h-full">
            {/* Statistics Row */}
            <div className="flex justify-center gap-8 py-6">
              <button
                onClick={(e) => {
                  console.log('High button clicked');
                  handleRatingClick('high', e);
                }}
                className="text-center cursor-pointer relative z-20 hover:opacity-80 transition-opacity"
                type="button"
              >
                <div className="flex items-center justify-center mb-2">
                  <div className="w-8 h-8 rounded-full border-2 border-primary flex items-center justify-center">
                    <Target className="h-4 w-4 text-primary" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-foreground">{ratingCounts.high}</div>
                <div className="text-sm text-muted-foreground font-medium">High</div>
              </button>
              
              <button
                onClick={(e) => {
                  console.log('Medium button clicked');
                  handleRatingClick('medium', e);
                }}
                className="text-center cursor-pointer relative z-20 hover:opacity-80 transition-opacity"
                type="button"
              >
                <div className="flex items-center justify-center mb-2">
                  <div className="w-8 h-8 rounded-full border-2 border-primary flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-primary" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-foreground">{ratingCounts.medium}</div>
                <div className="text-sm text-muted-foreground font-medium">Medium</div>
              </button>
              
              <button
                onClick={(e) => {
                  console.log('Low button clicked');
                  handleRatingClick('low', e);
                }}
                className="text-center cursor-pointer relative z-20 hover:opacity-80 transition-opacity"
                type="button"
              >
                <div className="flex items-center justify-center mb-2">
                  <div className="w-8 h-8 rounded-full border-2 border-primary flex items-center justify-center">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-foreground">{ratingCounts.low}</div>
                <div className="text-sm text-muted-foreground font-medium">Low</div>
              </button>
            </div>

            {/* Footer with Status Pills and Update Button */}
            <div className="mt-auto">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      console.log('Approved badge clicked');
                      handleApprovedClick(e);
                    }}
                    className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    type="button"
                  >
                    {approvedCount} Approved
                  </button>
                  {pendingCount > 0 && (
                    <button
                      onClick={(e) => {
                        console.log('Pending badge clicked');
                        handlePendingClick(e);
                      }}
                      className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                      type="button"
                    >
                      {pendingCount} Pending
                    </button>
                  )}
                  {rejectedCount > 0 && (
                    <button
                      onClick={(e) => {
                        console.log('Rejected badge clicked');
                        handleRejectedClick(e);
                      }}
                      className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                      type="button"
                    >
                      {rejectedCount} Rejected
                    </button>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    console.log('Update button clicked');
                    handleUpdateClick(e);
                  }}
                  className="h-8 px-3 text-sm relative z-30 shrink-0"
                  type="button"
                >
                  <Settings className="h-4 w-4 mr-1" />
                  Update
                </Button>
              </div>
            </div>
          </CardContent>

        </Card>
      </motion.div>

      <AddCategoryModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        category={category}
        onSuccess={() => {
          setShowEditModal(false);
          onRefresh();
        }}
      />

      <ApprovedRatingsModal
        open={showApprovedModal}
        onOpenChange={setShowApprovedModal}
        categoryName={category.name}
        ratings={userSkills}
        skills={skills.filter(skill => skill.category_id === category.id)}
        subskills={subskills.filter(subskill => 
          skills.some(skill => skill.id === subskill.skill_id && skill.category_id === category.id)
        )}
        filterRating={selectedRatingFilter}
      />

      <PendingRatingsModal
        open={showPendingModal}
        onOpenChange={setShowPendingModal}
        categoryName={category.name}
        ratings={userSkills}
        skills={skills.filter(skill => skill.category_id === category.id)}
        subskills={subskills.filter(subskill => 
          skills.some(skill => skill.id === subskill.skill_id && skill.category_id === category.id)
        )}
      />

      <RejectedRatingsModal
        open={showRejectedModal}
        onOpenChange={setShowRejectedModal}
        categoryName={category.name}
        ratings={userSkills}
        skills={skills.filter(skill => skill.category_id === category.id)}
        subskills={subskills.filter(subskill => 
          skills.some(skill => skill.id === subskill.skill_id && skill.category_id === category.id)
        )}
      />
    </>
  );
};