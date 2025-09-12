import { useState } from "react";
import { Input } from "@/components/ui/input";
import { RatingPill } from "@/components/common/RatingPill";
import type { Subskill, EmployeeRating } from "@/types/database";

interface InlineSubskillRatingProps {
  subskill: Subskill;
  userSkills: EmployeeRating[];
  pendingRatings: Map<string, { type: 'skill' | 'subskill', id: string, rating: 'high' | 'medium' | 'low' }>;
  onSubskillRate: (subskillId: string, rating: 'high' | 'medium' | 'low') => void;
  onCommentChange: (subskillId: string, comment: string) => void;
  comment: string;
}

export const InlineSubskillRating = ({
  subskill,
  userSkills,
  pendingRatings,
  onSubskillRate,
  onCommentChange,
  comment
}: InlineSubskillRatingProps) => {
  // Get current rating from pending ratings or saved ratings
  const getCurrentRating = () => {
    const pending = pendingRatings.get(subskill.id);
    if (pending && pending.type === 'subskill') return pending.rating;
    return userSkills.find(us => us.subskill_id === subskill.id)?.rating as 'high' | 'medium' | 'low' | null;
  };
  
  const userSkillRating = getCurrentRating();
  const userSkillStatus = userSkills.find(us => us.subskill_id === subskill.id)?.status;
  const isDisabled = userSkillStatus === 'submitted' || userSkillStatus === 'approved';

  return (
    <div className="flex items-center gap-4 p-3 border rounded-lg bg-card/50">
      {/* Subskill Name and Description */}
      <div className="flex-1 min-w-0">
        <h5 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-1">
          {subskill.name}
        </h5>
        {subskill.description && (
          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
            {subskill.description}
          </p>
        )}
      </div>

      {/* Rating Pills */}
      <div className="flex items-center justify-center min-w-fit">
        <RatingPill
          rating={userSkillRating}
          onRatingChange={(rating) => onSubskillRate(subskill.id, rating)}
          disabled={isDisabled}
          className="justify-center"
        />
      </div>

      {/* Comment Input */}
      <div className="flex-1 max-w-sm">
        <Input
          placeholder="Add your comment..."
          value={comment}
          onChange={(e) => onCommentChange(subskill.id, e.target.value)}
          disabled={isDisabled}
          className="text-sm h-8 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400"
        />
      </div>
    </div>
  );
};