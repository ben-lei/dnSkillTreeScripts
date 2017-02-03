SELECT (j._JobNumber + t._AwakenForceLevel) as _JobIndex,
    j._JobNumber,
--    j.ID as _JobID,
    s.ID as _SkillID,
    s._NameID,
    s._IconImageIndex,
    s._NeedWeaponType1,
    s._NeedWeaponType2,
    s._MaxLevel, -- max skill level
    s._SkillType,
    s._DurationType, -- instant, buff, debuff, ex
    s._Element,
    s._BaseSkillID, -- grouping of skill
    FLOOR(s._GlobalCoolTimePvP / 1000) as _GlobalCoolTimePvP,
    FLOOR(s._GlobalCoolTimePvE / 1000) as _GlobalCoolTimePvE,
    s._SkillGroup,
    t._TreeSlotIndex,
    t._NeedBasicSP1,
    t._NeedFirstSP1,
    t._NeedSecondSP1,
    t._ParentSkillID1,
    t._NeedParentSkillLevel1,
    t._ParentSkillID2,
    t._NeedParentSkillLevel2,
    t._ParentSkillID3,
    t._NeedParentSkillLevel3,
    t._ChangeSkill,
    t._TreeSkill
FROM skilltree t
    JOIN skill s
        ON (t._SkillTableID = s.ID)
    JOIN job j
        ON (j.ID = s._NeedJob)
WHERE j.ID IN (?, ?, ?)