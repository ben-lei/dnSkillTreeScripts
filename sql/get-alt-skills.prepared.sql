SELECT
    j._JobNumber,
    s.ID as _SkillID,
    s._NameID,
    s._SkillType,
    s._DurationType, -- instant, buff, debuff, ex
    s._Element,
    s._GlobalCoolTimePvP,
    s._GlobalCoolTimePvE
FROM skill s
  JOIN job j
    ON j.ID = s._NeedJob
WHERE s.ID IN (?)
	AND s._NeedJob IN (?, ?, ?)
