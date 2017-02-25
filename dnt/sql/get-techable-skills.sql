SELECT
    _SkillID, _ExchangeType, MAX(_LevelLimit) as _LevelLimit
FROM
    item
WHERE
    _ExchangeType BETWEEN 8 AND 10
        AND _SkillID != 0
        AND _isUse = 1
GROUP BY _SkillID, _ExchangeType
UNION SELECT DISTINCT -- get the weapon techs
    p._SkillID, 1 AS _ExchangeType, 10 as _LevelLimit
FROM
    potential p
        JOIN
    skill s ON s.ID = p._SkillID
WHERE
    p._SkillLevel != 0 AND s._NeedJob != 0;