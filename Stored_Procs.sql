USE [PHDTracking]
GO

/****** Object:  StoredProcedure [dbo].[CreateRequest]    Script Date: 11/1/2021 12:54:36 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

Create procedure [dbo].[createRequest]
@requestor varchar(max),
@requested varchar(max)
AS
Insert into Request
Values
(@requestor, @requested, getdate(),null,0,null)
GO

/****** Object:  StoredProcedure [dbo].[getAdvisoryRequest]    Script Date: 11/1/2021 12:54:36 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

Create procedure [dbo].[getAdvisoryRequest] 
@requestedID varchar(max)
AS
SELECT * FROM Request 
INNER JOIN [User] ON [User].NetID=Request.RequestorID
WHERE RequestedID= @requestedID AND Approved ='0'
GO

/****** Object:  StoredProcedure [dbo].[getProfessors]    Script Date: 11/1/2021 12:54:36 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

Create procedure [dbo].[getProfessors] 
AS
Select * from [User] WHERE RoleID = 1
GO

/****** Object:  StoredProcedure [dbo].[getRecommendations]    Script Date: 11/1/2021 12:54:36 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

Create procedure [dbo].[getRecommendations] 
AS
SELECT * FROM Recommendation
INNER JOIN [User] ON [User].NetID=Recommendation.RecommendedID
GO

/****** Object:  StoredProcedure [dbo].[getStudents]    Script Date: 11/1/2021 12:54:36 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

Create procedure [dbo].[getStudents] 
AS
SELECT * FROM [User] 
WHERE [User].RoleID=2
GO

/****** Object:  StoredProcedure [dbo].[getStudentsAllocated]    Script Date: 11/1/2021 12:54:36 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

Create procedure [dbo].[getStudentsAllocated] 
@allocatedToID varchar(max)
AS
SELECT * FROM Allocation 
INNER JOIN [User] 
ON [User].[NetID]=Allocation.AllocatedID 
WHERE AllocatedToID = @allocatedToID
GO

/****** Object:  StoredProcedure [dbo].[getUnallocatedStudents]    Script Date: 11/1/2021 12:54:36 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

Create procedure [dbo].[getUnallocatedStudents] 
AS
Select [User].* from [User] 
left join Allocation a 
on a.AllocatedID = [User].NetID
WHERE RoleID = 2
and a.AllocationID is null
GO

/****** Object:  StoredProcedure [dbo].[giveRecommendation]    Script Date: 11/1/2021 12:54:36 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

Create procedure [dbo].[giveRecommendation]
@requestor varchar(max),
@requested varchar(max),
@text varchar(max)
AS
if not exists(select * from Recommendation where RecommenderID = @requestor 
and RecommendedID = @requested)
BEGIN
Insert into Recommendation 
values 
(@requestor, @requested, @text, getdate())
END
ELSE
BEGIN
    RAISERROR ('Student already has your recommendation', -- Message text.  
               16, -- Severity.  
               1 -- State.  
               );
END
GO

/****** Object:  StoredProcedure [dbo].[removeAllocation]    Script Date: 11/1/2021 12:54:36 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

Create procedure [dbo].[removeAllocation]
@allocationID varchar(max)
AS
delete from Allocation 
where allocationID = @allocationID
GO

/****** Object:  StoredProcedure [dbo].[setAllocation]    Script Date: 11/1/2021 12:54:36 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

Create procedure [dbo].[setAllocation]
@allocated varchar(max),
@allocatedTo varchar(max)
AS
Insert into Allocation 
values 
(@allocated, @allocatedTo, getdate())
GO

/****** Object:  StoredProcedure [dbo].[setApproved]    Script Date: 11/1/2021 12:54:36 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

Create procedure [dbo].[setApproved]
@requestID varchar(max)
AS
update request
set Approved = 1
where RequestID = @requestID
GO


