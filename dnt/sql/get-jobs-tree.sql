SELECT
    LOWER(_EnglishName) AS _EnglishName,
    m._Message AS JobName,
    _JobIcon,
    _BaseClass
FROM
    job j
        JOIN
    message m ON m.ID = j._JobName
WHERE
    _Service = 1 AND _JobNumber = 2
ORDER BY _BaseClass , _ParentJob , j.ID ASC