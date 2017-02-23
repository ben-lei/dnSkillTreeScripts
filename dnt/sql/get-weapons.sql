SELECT DISTINCT
    w._EquipType, m.ID AS _NameID
FROM
    item i
        JOIN
    weapon w ON i.ID = w.ID
        JOIN
    message m ON m.ID = REPLACE(REPLACE(i._NameIDParam, '{', ''),
        '}',
        '')
WHERE
    i._NameID = 1000006853
        AND i._LevelLimit = 1