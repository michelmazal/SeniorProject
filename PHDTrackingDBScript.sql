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
NetID nvarchar(10) not null, 
RoleID int not null,
FirstName varchar(250) not null,
LastName varchar(250) not null,
FullName varchar(250) not null,
Phone varchar(15) null,
Email varchar(250) null,
CONSTRAINT PK_NetIDRole PRIMARY KEY (NetID,RoleID),
)


CREATE TABLE dbo.UserRoleMember (
RoleID int not null Identity(1,1) Primary Key,
UserRole nvarchar(250) not null,
)


CREATE TABLE dbo.Request (
RequestID int not null Identity(1,1) Primary Key,
RequestorID nvarchar(10) not null,
RequestedID nvarchar(10) not null,
DateRequested date null,
)


CREATE TABLE dbo.Recommendation (
RecommendationID int not null Identity(1,1) Primary Key,
RecommenderID nvarchar(10) not null,
	[RecommendedID] [nvarchar](10) NOT NULL,
	[First_Name] [nvarchar](max) NOT NULL,
	[Last_Name] [nvarchar](max) NOT NULL,
	[Phone] [nvarchar](max) NOT NULL,
	[Email] [nvarchar](max) NOT NULL,
	[DateRecommended] [datetime] NOT NULL,
)


CREATE TABLE dbo.Allocation (
AllocationID int not null Identity(1,1) Primary Key,
AllocatedID nvarchar(10) not null,
AllocatedToID nvarchar(10) not null,
AllocatedDate datetime not null,
)

