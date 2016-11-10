SELECT
    j._Class AS _Basic,
    j._ParentJob AS _First,
    j.ID,
    LOWER(j._EnglishName) AS _EnglishName,
    m._Message AS _Name,
    j._JobIcon,
    j1._JobIcon AS _BasicJobIcon,
    m1._Message AS _BasicName,
    j2._JobIcon AS _FirstJobIcon,
    m2._Message AS _FirstName,
    j._MaxSPJob0,
    j._MaxSPJob1,
    j._MaxSPJob2
FROM
    job j
        JOIN
    message m ON m.ID = j._JobName
        JOIN
    job j1 ON j1.ID = j._Class
        JOIN
    message m1 ON j1._JobName = m1.ID
        JOIN
    job j2 ON j2.ID = j._ParentJob
        JOIN
    message m2 ON j2._JobName = m2.ID
WHERE
    j._Service = 1 AND j._JobNumber = 2
ORDER BY j._Class , j._ParentJob , j.ID ASC