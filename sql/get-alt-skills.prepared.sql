SELECT
    j._JobNumber,
    s.ID as _SkillID,
    s._NameID,
    s._SkillType,
    s._DurationType, -- instant, buff, debuff, ex
    s._Element,
    FLOOR(s._GlobalCoolTimePvP / 1000) as _GlobalCoolTimePvP,
    FLOOR(s._GlobalCoolTimePvE / 1000) as _GlobalCoolTimePvE
FROM skill s
  JOIN job j
    ON j.ID = s._NeedJob
WHERE s.ID IN (?)
	AND s._NeedJob IN (?, ?, ?)
