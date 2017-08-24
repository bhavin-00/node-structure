//For Creating tbl_SubCategoryMasterBhavin Table
CREATE TABLE `nodejsstructure`.`tbl_SubCategoryMasterBhavin` (
  `pk_subCategoryId` INT(11) NOT NULL  AUTO_INCREMENT,
  `subCategory` VARCHAR(100) NULL,
  `description` VARCHAR(256) NULL,
  `imageName` VARCHAR(256) NULL,
  `isActive` TINYINT(1) NULL DEFAULT 1,
  `createdDate` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `modifiedDate` DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `fk_createdBy` INT(11) NULL,
  `fk_categoryId` INT(11) NULL,
  PRIMARY KEY (`pk_subCategoryId`),
  INDEX `fk_categoryId_idx` (`fk_createdBy` ASC),
  INDEX `fk_createdBy_idx` (`fk_categoryId` ASC),
  CONSTRAINT `fk_categoryId`
    FOREIGN KEY (`fk_categoryId`)
    REFERENCES `nodejsstructure`.`tbl_CategoryMaster` (`pk_categoryID`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_createdBy`
    FOREIGN KEY (`fk_createdBy`)
    REFERENCES `nodejsstructure`.`tbl_UserMaster` (`pk_userID`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION);
