SELECT
    g._SkillID,
    g._SummaryDescription,
    g._SummaryDescriptionParam
FROM
    glyphskill g
        JOIN
    item i ON g.ID = i.ID
WHERE
    g._SkillID != 0 AND g._GlyphType = 2
        AND i._DescriptionID != 1000098590
        AND i._Rank = 3