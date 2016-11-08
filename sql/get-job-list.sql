SELECT j._Class as _Basic,
    j._ParentJob as _First,
    j.ID,
    LOWER(j._EnglishName) as _EnglishName,
    m._Message as _Name,
    j._JobIcon,
    j1._JobIcon as _BasicJobIcon,
    m1._Message as _BasicName,
    j2._JobIcon as _FirstJobIcon,
    m2._Message as _FirstName,
    j._MaxSPJob0,
    j._MaxSPJob1,
    j._MaxSPJob2
FROM job j
	JOIN message m
		ON m.ID = j._JobName
    JOIN job j1
		ON j1.ID = j._Class
    JOIN message m1
        ON j1._JobName = m1.ID
    JOIN job j2
		ON j2.ID = j._ParentJob
    JOIN message m2
        ON j2._JobName = m2.ID
WHERE j._Service = 1
    AND j._JobNumber = 2
ORDER BY j._Class, j._ParentJob, j.ID ASC