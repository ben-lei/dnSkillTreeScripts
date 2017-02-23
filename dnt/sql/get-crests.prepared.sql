SELECT
    g._SkillID,
    i._DescriptionID,
    i._DescriptionIDParam
FROM
    glyphskill g
        JOIN
    item i ON g.ID = i.ID
WHERE i._DescriptionID != 1000098590
        AND i._Rank = 3
        AND i._NeedJobClass IN (? , ?, ?)
GROUP BY
    g._SkillID,
    i._DescriptionID,
    i._DescriptionIDParam