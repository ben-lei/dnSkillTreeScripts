SELECT
    LOWER(_EnglishName) AS _EnglishName,
    m._Message AS JobName,
    _JobIcon,
    _BaseClass,
    (
		SELECT _AwakenForceLevel
        FROM skilltree t
        WHERE t._SkillNeedJobID = j.ID
        ORDER BY t._AwakenForceLevel DESC
        LIMIT 1
	) as _Awakened
FROM
    job j
        JOIN
    message m ON m.ID = j._JobName
WHERE
    _Service = 1 AND _JobNumber = 2
ORDER BY _BaseClass , _ParentJob , j.ID ASC