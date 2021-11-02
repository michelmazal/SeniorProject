USE [PHDTracking]
GO

/****** Object:  StoredProcedure [dbo].[createRequest]    Script Date: 11/1/2021 8:21:04 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE procedure [dbo].[createRequest]
@requestor varchar(max),
@requested varchar(max)
AS
Insert into Request
Values
(@requestor, @requested, getdate())
GO

/****** Object:  StoredProcedure [dbo].[getAdvisoryRequest]    Script Date: 11/1/2021 8:21:04 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE procedure [dbo].[getAdvisoryRequest] 
@requestedID varchar(max)
AS
SELECT * FROM Request 
INNER JOIN [User] ON [User].NetID=Request.RequestorID
WHERE RequestedID= @requestedID
GO

/****** Object:  StoredProcedure [dbo].[getProfessors]    Script Date: 11/1/2021 8:21:04 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE procedure [dbo].[getProfessors] 
@currentNetID varchar(max)
AS
Select [User].*,
case when requestID is not null then 1 else 0
end as isAlreadyRequested

from [User]
left join Request 
on Request.RequestorID = @currentNetID
WHERE RoleID = 1
GO

/****** Object:  StoredProcedure [dbo].[getRecommendations]    Script Date: 11/1/2021 8:21:04 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE procedure [dbo].[getRecommendations] 
AS
SELECT * FROM Recommendation
INNER JOIN [User] ON [User].NetID=Recommendation.RecommendedID
GO

/****** Object:  StoredProcedure [dbo].[getStudents]    Script Date: 11/1/2021 8:21:04 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE procedure [dbo].[getStudents] 
AS
SELECT * FROM [User] 
WHERE [User].RoleID=2
GO

/****** Object:  StoredProcedure [dbo].[getStudentsAllocated]    Script Date: 11/1/2021 8:21:04 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE procedure [dbo].[getStudentsAllocated] 
@allocatedToID varchar(max)
AS
SELECT * FROM Allocation 
INNER JOIN [User] 
ON [User].[NetID]=Allocation.AllocatedID 
WHERE AllocatedToID = @allocatedToID
GO

/****** Object:  StoredProcedure [dbo].[getUnallocatedStudents]    Script Date: 11/1/2021 8:21:04 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE procedure [dbo].[getUnallocatedStudents] 
AS
Select [User].* from [User] 
left join Allocation a 
on a.AllocatedID = [User].NetID
WHERE RoleID = 2
and a.AllocationID is null
GO

/****** Object:  StoredProcedure [dbo].[giveRecommendation]    Script Date: 11/1/2021 8:21:04 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE procedure [dbo].[giveRecommendation]
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

/****** Object:  StoredProcedure [dbo].[removeAllocation]    Script Date: 11/1/2021 8:21:04 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE procedure [dbo].[removeAllocation]
@allocatedID varchar(max),
@allocatedTo varchar(max)
AS
delete from Allocation 
where AllocatedID = @allocatedID
and AllocatedToID = @allocatedTo
GO

/****** Object:  StoredProcedure [dbo].[setAllocation]    Script Date: 11/1/2021 8:21:04 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE procedure [dbo].[setAllocation]
@allocated varchar(max),
@allocatedTo varchar(max)
AS

delete from Request 
where requestorID = @allocated
and RequestedID = @allocatedTo

Insert into Allocation 
values 
(@allocated, @allocatedTo, getdate())

GO


