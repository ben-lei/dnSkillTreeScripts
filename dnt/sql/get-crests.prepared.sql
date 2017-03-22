-- slow query... but not sure how else to do it in 1 go efficiently
SELECT t._SkillTableID as _SkillID,
    i._DescriptionID,
    i._DescriptionIDParam
FROM glyphskill g
	JOIN item i
		ON g.ID = i.ID
	JOIN skilltree t
		ON (
				t._SkillTableID = g._SkillID
					OR g._SkillID LIKE CONCAT(t._SkillTableID, ';%')
					OR g._SkillID LIKE CONCAT('%;', t._SkillTableID, ';%')
					OR g._SkillID LIKE CONCAT('%;', t._SkillTableID)
					OR
				t._SubSkillTableID = g._SkillID
					OR g._SkillID LIKE CONCAT(t._SubSkillTableID, ';%')
					OR g._SkillID LIKE CONCAT('%;', t._SubSkillTableID, ';%')
					OR g._SkillID LIKE CONCAT('%;', t._SubSkillTableID)
      )
WHERE i._DescriptionID != 1000098590
        AND i._Rank = 3
        AND i._SellAmount = 0
        AND i._NeedJobClass IN (?, ?, ?)


