SELECT
    t._ChangeSkill
FROM skill s
	JOIN skilltree t
		ON t._SkillTableID = s.ID
	JOIN skilltree t2
    ON (
			t2._TreeSkill = s.ID
				OR t2._TreeSkill LIKE CONCAT(s.ID, ';%')
				OR t2._TreeSkill LIKE CONCAT('%;', s.ID, ';%')
				OR t2._TreeSkill LIKE CONCAT('%;', s.ID)
		) AND t2._SkillNeedJobID IN (?, ?, ?)
WHERE t._ChangeSkill != ''
GROUP BY t._ChangeSkill