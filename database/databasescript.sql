drop database if exists nodejsstructure;

create database nodejsstructure;

use nodejsstructure;

drop table if exists tbl_UserType;
CREATE TABLE `tbl_UserType` (
  `pk_userTypeID` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(50) NOT NULL,
  `createdDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modifiedDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`pk_userTypeID`),
  UNIQUE KEY `userType_UNIQUE` (`type`)
);


drop table if exists tbl_CountryMaster;
CREATE TABLE `tbl_CountryMaster` (
  `pk_countryID` int(11) NOT NULL AUTO_INCREMENT,
  `countryCode` varchar(10) NOT NULL,
  `countryName` varchar(100) NOT NULL,
  `createdDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modifiedDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`pk_countryID`),
  UNIQUE KEY `countryName_UNIQUE` (`countryName`)
) ;


drop table if exists tbl_StateMaster;
CREATE TABLE `tbl_StateMaster` (
  `pk_stateID` int(11) NOT NULL AUTO_INCREMENT,
  `fk_countryID` int(11) NOT NULL,
  `stateName` varchar(100) NOT NULL,
  `createdDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modifiedDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`pk_stateID`,`fk_countryID`),
  UNIQUE KEY `stateName_unique` (`stateName`),
  KEY `fk_tbl_StateMaster_tbl_CountryMaster_idx` (`fk_countryID`),
  CONSTRAINT `fk_tbl_StateMaster_tbl_CountryMaster` FOREIGN KEY (`fk_countryID`) REFERENCES `tbl_CountryMaster` (`pk_countryID`) ON DELETE CASCADE ON UPDATE NO ACTION
);


drop table if exists tbl_CityMaster;
CREATE TABLE `tbl_CityMaster` (
  `pk_cityID` int(11) NOT NULL AUTO_INCREMENT,
  `fk_countryID` int(11) NOT NULL,
  `fk_stateID` int(11) NOT NULL,
  `cityName` varchar(100) NOT NULL,
  `createdDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modifiedDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`pk_cityID`,`fk_countryID`,`fk_stateID`),
  UNIQUE KEY `city_unique` (`fk_countryID`,`fk_stateID`,`cityName`),
  KEY `fk_tbl_CityMaster_tbl_StateMaster2_idx` (`fk_stateID`),
  KEY `fk_tbl_CityMaster_tbl_CountryMaster1_idx` (`fk_countryID`),
  CONSTRAINT `fk_tbl_CityMaster_tbl_CountryMaster1` FOREIGN KEY (`fk_countryID`) REFERENCES `tbl_CountryMaster` (`pk_countryID`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `fk_tbl_CityMaster_tbl_StateMaster2` FOREIGN KEY (`fk_stateID`) REFERENCES `tbl_StateMaster` (`pk_stateID`) ON DELETE CASCADE ON UPDATE NO ACTION
);


drop table if exists tbl_RoleMaster;
CREATE TABLE `tbl_RoleMaster` (
  `pk_RoleID` int(11) NOT NULL,
  `role` varchar(45) DEFAULT NULL,
  `fk_userTypeID` int(11) DEFAULT NULL,
  PRIMARY KEY (`pk_RoleID`),
  KEY `fk_tbl_RoleMaster_1_idx` (`fk_userTypeID`),
  CONSTRAINT `fk_tbl_RoleMaster_1` FOREIGN KEY (`fk_userTypeID`) REFERENCES `tbl_UserType` (`pk_userTypeID`) ON DELETE CASCADE ON UPDATE NO ACTION
);

drop table if exists tbl_PathMaster;
CREATE TABLE `tbl_PathMaster` (
  `pk_pathID` int(11) NOT NULL AUTO_INCREMENT,
  `path` varchar(100) NOT NULL,
  `isActive` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`pk_pathID`),
  UNIQUE KEY `pathmaster_unique` (`path`)
);


drop table if exists tbl_UserMaster;
CREATE TABLE `tbl_UserMaster` (
  `pk_userID` int(11) NOT NULL AUTO_INCREMENT,
  `fk_roleID` int(11) NOT NULL,
  `fk_cityID` int(11) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `countryCode` int(11) NOT NULL,
  `mobile` varchar(20) NOT NULL,
  `password` varchar(100) DEFAULT NULL,
  `facebookID` varchar(100) DEFAULT NULL,
  `googleID` varchar(100) DEFAULT NULL,
  `photo` varchar(250) DEFAULT NULL,
  `fk_pathID` int(11) DEFAULT NULL,
  `createdDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `modifiedDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `isActive` tinyint(1) DEFAULT '1',
  `isVerified` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`pk_userID`),
  UNIQUE KEY `tbl_UserMaster_UN` (`mobile`),
  UNIQUE KEY `tbl_UserMaster_UN_email` (`email`),
  KEY `fk_tbl_UserMaster_tbl_UserType1_idx` (`fk_roleID`),
  KEY `fk_tbl_UserMaster_tbl_CityMaster1_idx` (`fk_cityID`),
  KEY `tbl_UserMaster_tbl_PathMaster_FK` (`fk_pathID`),
  CONSTRAINT `fk_tbl_UserMaster_tbl_CityMaster1` FOREIGN KEY (`fk_cityID`) REFERENCES `tbl_CityMaster` (`pk_cityID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_tbl_UserMaster_tbl_UserType1` FOREIGN KEY (`fk_roleID`) REFERENCES `tbl_RoleMaster` (`pk_RoleID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `tbl_UserMaster_tbl_PathMaster_FK` FOREIGN KEY (`fk_pathID`) REFERENCES `tbl_PathMaster` (`pk_pathID`) ON DELETE CASCADE
);



drop table if exists tbl_ModuleMaster;
CREATE TABLE `tbl_ModuleMaster` (
  `pk_moduleID` int(11) NOT NULL AUTO_INCREMENT,
  `moduleName` varchar(45) NOT NULL,
  `adminCreated` tinyint(4) DEFAULT NULL,
  `seqNo` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`pk_moduleID`)
);

drop table if exists tbl_RoleModuleMapping;
CREATE TABLE `tbl_RoleModuleMapping` (
  `pk_userMappingID` int(11) NOT NULL AUTO_INCREMENT,
  `fk_moduleID` int(11) DEFAULT NULL,
  `fk_roleID` int(11) DEFAULT NULL,
  `canView` tinyint(4) DEFAULT NULL,
  `canAddEdit` tinyint(4) DEFAULT NULL,
  `canDelete` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`pk_userMappingID`),
  KEY `fk_tbl_UserModuleMapping_1_idx` (`fk_moduleID`),
  KEY `tbl_UserModuleMapping_tbl_ModuleMaster_FK_1_idx` (`fk_roleID`),
  CONSTRAINT `fk_tbl_UserModuleMapping_1` FOREIGN KEY (`fk_roleID`) REFERENCES `tbl_RoleMaster` (`pk_RoleID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `tbl_UserModuleMapping_tbl_ModuleMaster_FK` FOREIGN KEY (`fk_moduleID`) REFERENCES `tbl_ModuleMaster` (`pk_moduleID`) ON DELETE CASCADE
);


drop table if exists tbl_AccessToken;
CREATE TABLE `tbl_AccessToken` (
  `pk_tokenID` int(11) NOT NULL AUTO_INCREMENT,
  `fk_userID` int(11) NOT NULL,
  `token` varchar(50) NOT NULL,
  `cretatedDateTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `expiryDateTime` datetime NOT NULL,
  `deviceID` varchar(50) DEFAULT NULL,
  `isExpired` tinyint(1) DEFAULT '0',
  `requestHost` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`pk_tokenID`,`fk_userID`),
  KEY `fk_tbl_AccessToken_tbl_UserMaster1_idx` (`fk_userID`),
  CONSTRAINT `fk_tbl_AccessToken_tbl_UserMaster1` FOREIGN KEY (`fk_userID`) REFERENCES `tbl_UserMaster` (`pk_userID`) ON DELETE CASCADE ON UPDATE NO ACTION
) ;


drop table if exists tbl_Logger;
CREATE TABLE `tbl_Logger` (
  `pk_logID` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(10) NOT NULL,
  `URL` varchar(5000) NOT NULL,
  `headers` text,
  `body` text,
  `params` varchar(5000) DEFAULT NULL,
  `query` varchar(5000) DEFAULT NULL,
  `fk_userID` int(11) DEFAULT NULL,
  `createdDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ipAddress` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`pk_logID`),
  KEY `tbl_Logger_tbl_UserMaster_FK` (`fk_userID`)
);



drop table if exists tbl_transactionMaster;
CREATE TABLE `tbl_transactionMaster` (
  `pk_transactionID` int(11) NOT NULL AUTO_INCREMENT,
  `deviceID` varchar(100) NOT NULL,
  `pushToken` varchar(100) DEFAULT NULL,
  `deviceType` varchar(100) NOT NULL,
  `lastloginDateTime` datetime DEFAULT NULL,
  `isLogedIn` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`pk_transactionID`)
);



drop table if exists tbl_OTP;
CREATE TABLE `tbl_OTP` (
  `pk_otpID` int(11) NOT NULL AUTO_INCREMENT,
  `countryCode` varchar(10) NOT NULL,
  `mobile` varchar(20) NOT NULL,
  `OTP` int(11) NOT NULL,
  `expiryDateTime` datetime NOT NULL,
  `isExpired` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`pk_otpID`)
);


drop view if exists view_GetUserDetail;
create VIEW `view_GetUserDetail` AS
select `UM`.`pk_userID` AS `pk_userId`,`UM`.`name` AS `name`,`UM`.`countryCode` AS `countryCode`,`UM`.`mobile` AS `mobile`,`UM`.`email` AS `email`,`UM`.`photo` AS `photo`,
`RM`.`role` AS `role`,`RM`.`pk_RoleID` AS `roleID`,`RM`.`fk_userTypeID` AS `userTypeID`,`MM`.`moduleName` AS `moduleName`,
`MM`.`adminCreated` AS `adminCreated`,`UMM`.`canView` AS `canView`,`UMM`.`canAddEdit` AS `canAddEdit`,`UMM`.`canDelete` AS `canDelete`,`UM`.`isActive` AS `isActive`,
`UM`.`isVerified` AS `isVerified`,`UM`.`password` AS `password`
from (((`tbl_UserMaster` `UM`
join `tbl_RoleMaster` `RM` on((`RM`.`pk_RoleID` = `UM`.`fk_roleID`)))
join `tbl_RoleModuleMapping` `UMM` on((`RM`.`pk_RoleID` = `UMM`.`fk_roleID`)))
join `tbl_ModuleMaster` `MM` on((`MM`.`pk_moduleID` = `UMM`.`fk_moduleID`)))
order by `MM`.`seqNo`;

drop view if exists view_AccessToken;

create VIEW `view_AccessToken` AS
select `UM`.`pk_userID` AS `userId`,`UM`.`name` AS `name`,`UM`.`mobile` AS `mobile`,`AT`.`token` AS `token`,`AT`.`deviceID` AS `deviceId`,`AT`.`expiryDateTime` AS `expiryDateTime`,
`RM`.`role` AS `role`,`RM`.`pk_RoleID` AS `roleID`,`RM`.`fk_userTypeID` AS `userTypeID`,`AT`.`requestHost` AS `requestHost`,
`MM`.`moduleName` AS `moduleName`,`MM`.`adminCreated` AS `adminCreated`,`UMM`.`canView` AS `canView`,`UMM`.`canAddEdit` AS `canAddEdit`,`UMM`.`canDelete` AS `canDelete`
from ((((`tbl_AccessToken` `AT`
join `tbl_UserMaster` `UM` on((`AT`.`fk_userID` = `UM`.`pk_userID`)))
join `tbl_RoleMaster` `RM` on((`RM`.`pk_RoleID` = `UM`.`fk_roleID`)))
join `tbl_RoleModuleMapping` `UMM` on((`RM`.`pk_RoleID` = `UMM`.`fk_roleID`)))
join `tbl_ModuleMaster` `MM` on((`MM`.`pk_moduleID` = `UMM`.`fk_moduleID`)))
where ((`AT`.`isExpired` = 0) and (`AT`.`expiryDateTime` > now())) order by `MM`.`seqNo`;


drop table if exists tbl_CategoryMaster;
CREATE TABLE `tbl_CategoryMaster` (
  `pk_categoryID` int(11) NOT NULL AUTO_INCREMENT,
  `fk_createdBy` int(11) NOT NULL,
  `category` varchar(100) DEFAULT NULL,
  `description` varchar(256) DEFAULT NULL,
  `imageName` varchar(256) DEFAULT NULL,
  `fk_pathID` int(11) DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT '1',
  `createdDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `modifiedDate` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`pk_categoryID`),
  KEY `tbl_CategoryMaster_tbl_PathMaster_FK` (`fk_pathID`),
  KEY `tbl_CategoryMaster_tbl_UserMaster_FK` (`fk_createdBy`),
  CONSTRAINT `tbl_CategoryMaster_tbl_PathMaster_FK` FOREIGN KEY (`fk_pathID`) REFERENCES `tbl_PathMaster` (`pk_pathID`) ON DELETE CASCADE,
  CONSTRAINT `tbl_CategoryMaster_tbl_UserMaster_FK` FOREIGN KEY (`fk_createdBy`) REFERENCES `tbl_UserMaster` (`pk_userID`) ON DELETE CASCADE
);



insert into tbl_UserType (type,isActive) values('admin',1);
insert into tbl_RoleMaster(pk_RoleID,role,fk_userTypeID)values(1,'admin',1);
insert into tbl_ModuleMaster(moduleName,adminCreated,seqNo)values('user',1,1);
insert into tbl_RoleModuleMapping(fk_moduleID,fk_roleID,canView,canAddEdit,canDelete) values(1,1,1,1,1);
insert into tbl_ModuleMaster(moduleName,adminCreated,seqNo)values('dashboard',1,2);
insert into tbl_RoleModuleMapping(fk_moduleID,fk_roleID,canView,canAddEdit,canDelete) values(2,1,1,1,1);
insert into tbl_ModuleMaster(moduleName,adminCreated,seqNo)values('role',1,3);
insert into tbl_RoleModuleMapping(fk_moduleID,fk_roleID,canView,canAddEdit,canDelete) values(3,1,1,1,1);
insert into tbl_PathMaster(path,isActive)values('D:/gitlab/server/images/',1);
insert into tbl_ModuleMaster(moduleName,adminCreated,seqNo)values('category',1,4);
insert into tbl_RoleModuleMapping(fk_moduleID,fk_roleID,canView,canAddEdit,canDelete) values(4,1,1,1,1);
