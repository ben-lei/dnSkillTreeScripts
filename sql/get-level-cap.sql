SELECT i._LevelLimit
FROM item i
	LEFT OUTER JOIN charmitem c
    ON i._TypeParam1 = c._CharmNum
WHERE i._NameID = 1000045638
    AND c.ID is NOT NULL
ORDER BY _LevelLimit DESC LIMIT 1