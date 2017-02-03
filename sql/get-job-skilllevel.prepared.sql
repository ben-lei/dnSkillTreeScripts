SELECT l._SkillIndex as _SkillID,
    (l._SkillLevel - 1) as _SkillLevel, -- convenient 0 based index
    l._LevelLimit, -- char level req to reach this skill level
    l._DelayTime, -- skill cooldown
    l._DecreaseHP,
    l._DecreaseSP,
    l._SkillExplanationID,
    l._SkillExplanationIDParam,
    l._NeedSkillPoint,
    l._ApplyType
FROM skilllevel l
WHERE l._SkillIndex IN (?)
ORDER BY l._SkillIndex, l._SkillLevel ASC