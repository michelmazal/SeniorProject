IF NOT EXISTS(Select * from sys.databases where name = 'PHDTracking')
BEGIN
CREATE DATABASE PHDTracking
END
GO

USE PHDTracking
GO

if exists(select * from sys.tables where name = 'Allocation')
	Drop Table dbo.Allocation

if exists(select * from sys.tables where name = 'Recommendation')
	Drop Table dbo.Recommendation

if exists(select * from sys.tables where name = 'Request')
	Drop Table dbo.Request

if exists(select * from sys.tables where name = 'UserRoleMember')
	Drop Table dbo.UserRoleMember

if exists(select * from sys.tables where name = 'User')
	Drop Table dbo.[User]


/*Create Tables*/

CREATE TABLE dbo.[User] (
NetID nvarchar(10) not null Primary Key CLUSTERED (NetID ASC), 
RoleID int not null,
FirstName varchar(250) not null,
LastName varchar(250) not null,
FullName varchar(250) not null,
Phone varchar(15) null,
Email varchar(250) null,
)


CREATE TABLE dbo.UserRoleMember (
RoleID int not null Identity(1,1) Primary Key,
UserRole nvarchar(250) not null,
)


CREATE TABLE dbo.Request (
RequestID int not null Identity(1,1) Primary Key,
RequestorID nvarchar(10) not null,
RequestedID nvarchar(10) not null,
DateRequested datetime null,
DateSent datetime null,
Approved bit not null default 0,
ApprovedDate datetime null
FOREIGN KEY(RequestorID) REFERENCES [USER](NetID),
FOREIGN KEY(RequestedID) REFERENCES [USER](NetID),
)


CREATE TABLE dbo.Recommendation (
RecommendationID int not null Identity(1,1) Primary Key,
RecommenderID nvarchar(10) not null,
RecommendedID nvarchar(10) not null,
RecommendationText Nvarchar(max) null,
DateRecommended datetime not null,
FOREIGN KEY(RecommenderID) REFERENCES [USER](NetID),
FOREIGN KEY(RecommendedID) REFERENCES [USER](NetID),
)


CREATE TABLE dbo.Allocation (
AllocationID int not null Identity(1,1) Primary Key,
AllocatedID nvarchar(10) not null,
AllocatedToID nvarchar(10) not null,
AllocatedDate datetime not null,
FOREIGN KEY(AllocatedID) REFERENCES [USER](NetID),
FOREIGN KEY(AllocatedToID) REFERENCES [USER](NetID),
)
