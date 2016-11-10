SELECT
    g._SkillID,
    g._SummaryDescription,
    g._SummaryDescriptionParam
FROM
    glyphskill g
        JOIN
    item i ON g.ID = i.ID
        JOIN
    skill s ON s.ID = g._SkillID
WHERE
    g._SkillID != 0 AND g._GlyphType = 2
        AND i._DescriptionID != 1000098590
        AND i._Rank = 3
        AND s._NeedJob IN (?, ?, ?)