SELECT
    j._JobNumber,
    s.ID as _SkillID,
    s._NameID,
    s._IconImageIndex,
    s._NeedWeaponType1,
    s._NeedWeaponType2,
    s._MaxLevel, -- max skill level
    s._SPMaxLevel,
    s._SkillType,
    s._DurationType, -- instant, buff, debuff, ex
    s._Element,
    s._BaseSkillID, -- grouping of skill
    s._GlobalCoolTimePvP,
    s._GlobalCoolTimePvE,
    s._SkillGroup
FROM skill s
  JOIN job j
    ON j.ID = s._NeedJob
WHERE s.ID IN (?)
	AND s._NeedJob IN (?, ?, ?)
