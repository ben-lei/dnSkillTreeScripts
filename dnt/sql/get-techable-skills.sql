SELECT DISTINCT
    _SkillID, _ExchangeType
FROM
    item
WHERE
    _ExchangeType BETWEEN 8 AND 10
        AND _SkillID != 0
        AND _isUse = 1 
UNION SELECT DISTINCT
    p._SkillID, 1 AS _ExchangeType
FROM
    potential p
        JOIN
    skill s ON s.ID = p._SkillID
WHERE
    p._SkillLevel != 0 AND s._NeedJob != 0;