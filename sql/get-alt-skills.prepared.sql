SELECT
    s.ID as _SkillID,
    s._NameID,
    s._IconImageIndex,
    s._NeedJob,
    s._NeedWeaponType1,
    s._NeedWeaponType2,
    s._MaxLevel, -- max skill level
    s._SkillType,
    s._DurationType, -- instant, buff, debuff, ex
    s._Element,
    s._BaseSkillID, -- grouping of skill
    s._GlobalCoolTimePvP,
    s._GlobalCoolTimePvE,
    s._SkillGroup
FROM skill s
WHERE s.ID IN (?)
	AND s._NeedJob IN (?, ?, ?)
