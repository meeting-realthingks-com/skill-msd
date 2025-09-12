import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, Plus, Edit, Trash2 } from "lucide-react";
import { RatingPill } from "@/components/common/RatingPill";
import { SubskillRow } from "./SubskillRow";
import { InlineSubskillRating } from "./InlineSubskillRating";
import { AddSubskillModal } from "./admin/AddSubskillModal";
import { cn } from "@/lib/utils";
import type { Skill, Subskill, UserSkill, EmployeeRating } from "@/types/database";
import { useToast } from "@/hooks/use-toast";
interface SkillRowProps {
  skill: Skill;
  subskills: Subskill[];
  userSkills: UserSkill[] | EmployeeRating[];
  pendingRatings: Map<string, { type: 'skill' | 'subskill', id: string, rating: 'high' | 'medium' | 'low' }>;
  isManagerOrAbove: boolean;
  onClick?: () => void;
  onSkillRate: (skillId: string, rating: 'high' | 'medium' | 'low') => void;
  onSubskillRate: (subskillId: string, rating: 'high' | 'medium' | 'low') => void;
  onSaveRatings?: (ratingsWithComments: Array<{id: string, type: 'skill' | 'subskill', rating: 'high' | 'medium' | 'low', comment: string}>) => void;
  onRefresh: () => void;
  onEditSkill?: () => void;
  onDeleteSkill?: () => void;
  targetSubskillId?: string; // For highlighting specific subskill from search
  expanded?: boolean; // For controlled expansion
  onToggleExpanded?: () => void; // For toggling expansion
}
export const SkillRow = ({
  skill,
  subskills,
  userSkills,
  pendingRatings,
  isManagerOrAbove,
  onClick,
  onSkillRate,
  onSubskillRate,
  onSaveRatings,
  onRefresh,
  onEditSkill,
  onDeleteSkill,
  targetSubskillId,
  expanded,
  onToggleExpanded
}: SkillRowProps) => {
  const [isExpanded, setIsExpanded] = useState(expanded || false);
  const [showAddSubskill, setShowAddSubskill] = useState(false);
  const [comments, setComments] = useState<Record<string, string>>({});
  const hasSubskills = subskills.length > 0;
  const { toast } = useToast();

  // Update expansion state when controlled prop changes
  useEffect(() => {
    if (expanded !== undefined) {
      setIsExpanded(expanded);
    }
  }, [expanded]);

  // Get current rating from pending ratings or saved ratings
  const getCurrentSkillRating = () => {
    const pending = pendingRatings.get(skill.id);
    if (pending && pending.type === 'skill') return pending.rating;
    return userSkills.find(us => us.skill_id === skill.id && !us.subskill_id)?.rating as 'high' | 'medium' | 'low' | null;
  };
  
  const userSkillRating = getCurrentSkillRating();
  const userSkillStatus = userSkills.find(us => us.skill_id === skill.id && !us.subskill_id)?.status;

  const handleCommentChange = (id: string, comment: string) => {
    setComments(prev => ({ ...prev, [id]: comment }));
  };

  const subskillIds = subskills.map(s => s.id);
  const pendingItemsForSkill = Array.from(pendingRatings.entries())
    .filter(([id, r]) => (r.type === 'skill' && id === skill.id) || (r.type === 'subskill' && subskillIds.includes(id)))
    .map(([id, r]) => ({ id, ...r }));
  const pendingCountForSkill = pendingItemsForSkill.length;

  const handleSave = () => {
    if (!onSaveRatings) return;
    const items = pendingItemsForSkill.map(({ id, type, rating }) => ({
      id,
      type,
      rating,
      comment: (comments[id] || '').trim(),
    }));
    const missing = items.filter(i => !i.comment);
    if (missing.length > 0) {
      toast({ title: 'Comments required', description: 'Please add comments for all ratings in this skill.', variant: 'destructive' });
      return;
    }
    onSaveRatings(items);
  };

  const handleSkillClick = () => {
    if (hasSubskills) {
      if (onToggleExpanded) {
        onToggleExpanded();
      } else {
        setIsExpanded(!isExpanded);
      }
    } else {
      onClick?.();
    }
  };

  return <div className="border rounded-lg p-3 bg-card hover:shadow-md transition-all" onClick={!hasSubskills ? onClick : undefined}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          {hasSubskills && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkillClick}
              className="p-1 h-auto"
            >
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          )}
          
          <div className="flex-1 cursor-pointer" onClick={handleSkillClick}>
            <h4 className="font-medium text-sm text-slate-900 dark:text-slate-100">{skill.name}</h4>
            {skill.description && (
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{skill.description}</p>
            )}
          </div>

          {/* Only show rating for skills without subskills */}
          {!hasSubskills && <div onClick={e => e.stopPropagation()}>
              <RatingPill rating={userSkillRating} onRatingChange={rating => onSkillRate(skill.id, rating)} disabled={userSkillStatus === 'submitted' || userSkillStatus === 'approved'} className="ml-auto" />
            </div>}
        </div>

        {isManagerOrAbove && <div className="flex gap-1 ml-2" onClick={e => e.stopPropagation()}>
            <Button variant="ghost" size="sm" onClick={e => {
          e.stopPropagation();
          setShowAddSubskill(true);
        }} className="p-1 h-auto">
              <Plus className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="sm" onClick={e => {
          e.stopPropagation();
          onEditSkill?.();
        }} className="p-1 h-auto">
              <Edit className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="sm" onClick={e => {
          e.stopPropagation();
          onDeleteSkill?.();
        }} className="p-1 h-auto">
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>}
      </div>

      {hasSubskills && (
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleContent>
            <div className="mt-4 space-y-3">
              {subskills.map(subskill => (
                <InlineSubskillRating
                  key={subskill.id}
                  subskill={subskill}
                  userSkills={userSkills as EmployeeRating[]}
                  pendingRatings={pendingRatings}
                  onSubskillRate={onSubskillRate}
                  onCommentChange={handleCommentChange}
                  comment={comments[subskill.id] || ''}
                />
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Comment input for skills without subskills */}
      {!hasSubskills && (
        <div className="mt-3" onClick={e => e.stopPropagation()}>
          <input
            type="text"
            placeholder="Add your comment..."
            value={comments[skill.id] || ''}
            onChange={(e) => handleCommentChange(skill.id, e.target.value)}
            disabled={userSkillStatus === 'submitted' || userSkillStatus === 'approved'}
            className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          />
        </div>
      )}

      {/* Save Ratings Button for this skill */}
      {!isManagerOrAbove && pendingCountForSkill > 0 && onSaveRatings && (
        <div className="mt-3">
          <Button onClick={handleSave} size="sm">
            Save Ratings ({pendingCountForSkill})
          </Button>
        </div>
      )}

      <AddSubskillModal open={showAddSubskill} onOpenChange={setShowAddSubskill} skillId={skill.id} onSuccess={() => {
      setShowAddSubskill(false);
      onRefresh();
    }} />
    </div>;
};