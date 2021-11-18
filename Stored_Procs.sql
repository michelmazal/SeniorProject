USE [PHDTracking]
GO

/****** Object:  StoredProcedure [dbo].[acceptRecommendation]    Script Date: 11/18/2021 8:40:55 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE procedure [dbo].[acceptRecommendation] 
@studentID varchar(10)
AS
Insert into [User]

select 
RecommendedID,
3,
First_Name, 
Last_Name,
First_Name + ' ' + Last_Name,
Phone,
Email
from Recommendation
where RecommendedID = @studentID

delete from Recommendation
where RecommendedID = @studentID
GO

/****** Object:  StoredProcedure [dbo].[createRequest]    Script Date: 11/18/2021 8:40:55 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE procedure [dbo].[createRequest]
 @requestor varchar(max) ,
@requested varchar(max)
AS

if exists(select * from Request where RequestorID = @requested and RequestedID = @requestor)
BEGIN
if exists(select * from [User] where roleid = 1 and netid = @requestor)
BEGIN
exec setAllocation @requested, @requestor
END
else
Begin
exec setAllocation @requestor , @requested
END
end 
else
begin
Insert into Request
Values
(@requestor, @requested, getdate())
end
GO

/****** Object:  StoredProcedure [dbo].[getAdvisoryRequest]    Script Date: 11/18/2021 8:40:55 AM ******/
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
and [User].RoleID = 2
GO

/****** Object:  StoredProcedure [dbo].[getMyRecommendations]    Script Date: 11/18/2021 8:40:55 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


Create procedure [dbo].[getMyRecommendations] 
@currentUserID varchar(max)
AS
SELECT student.*,RecommendationText FROM Recommendation
INNER JOIN [User] student ON student.NetID=Recommendation.RecommendedID
where  recommendation.RecommenderID = @currentUserID
GO

/****** Object:  StoredProcedure [dbo].[getMyStudents]    Script Date: 11/18/2021 8:40:55 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE procedure [dbo].[getMyStudents] 
@allocatedToID varchar(max)
AS
SELECT [User].*,case when RecommendationID is null then 0 else 1 end as IsRecommendationDisabled FROM Allocation 
INNER JOIN [User] 
ON [User].[NetID]=Allocation.AllocatedID 
left join Recommendation 
on RecommendedID = NetID
and RecommenderID = @allocatedToID
WHERE AllocatedToID = @allocatedToID
and [user].RoleID = 2
GO

/****** Object:  StoredProcedure [dbo].[getProfessors]    Script Date: 11/18/2021 8:40:55 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE procedure [dbo].[getProfessors] 
  @currentUserID varchar(max)
AS
if not exists(select 1 from [user] inner join Allocation a
on a.AllocatedToID = NetID
and a.AllocatedID = @currentUserID
)
BEGIN
Select [User].*,
case when requestID is not null then 1 else 0
end as IsRequestDisabled,
case when AllocatedID is not null then 1 else 0
end as IsAdvisor
from [User]
left join Request 
on RequestedID = NetID
and Request.RequestorID = @currentUserID
left join Allocation a
on a.AllocatedToID = NetID
and a.AllocatedID = @currentUserID
WHERE RoleID = 1
END 
ELSE 
BEGIN 
Select [User].*,
case when AllocatedID is not null then 1 else 0
end as IsAdvisor
from [User]
left join Request 
on RequestedID = NetID
and Request.RequestorID = @currentUserID
inner join Allocation a
on a.AllocatedToID = NetID
and a.AllocatedID = @currentUserID
WHERE RoleID = 1
END
GO

/****** Object:  StoredProcedure [dbo].[getRecommendations]    Script Date: 11/18/2021 8:40:55 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE procedure [dbo].[getRecommendations] 
AS
select r.*, recommender.FullName as Recommended_By from Recommendation r
left join [User] recommender
on recommender.NetID = recommenderID
GO

/****** Object:  StoredProcedure [dbo].[getStudents]    Script Date: 11/18/2021 8:40:55 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE procedure [dbo].[getStudents] 
@roleToGet varchar(max)
AS
SELECT * FROM [User] 
WHERE 
([User].RoleID=2 and @roleToGet = 'RA') or ([User].RoleID=3 and @roleToGet = 'TA')
GO

/****** Object:  StoredProcedure [dbo].[getUnallocatedStudents]    Script Date: 11/18/2021 8:40:55 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE procedure [dbo].[getUnallocatedStudents] 
@currentUserID varchar(max)
AS
Select distinct [User].*, 
case when RequestID is null then 0 else 1 end as IsRequestDisabled,
case when RecommendationID is null then 0 else 1 end as IsRecommendationDisabled from [User] 
left join Allocation a 
on a.AllocatedID = [User].NetID
left join Request
on NetID = RequestedID
and RequestorID = @currentUserID
left join Recommendation 
on RecommendedID = NetID
and RecommenderID = @currentUserID
WHERE RoleID = 2
and a.AllocationID is null

GO

/****** Object:  StoredProcedure [dbo].[giveRecommendation]    Script Date: 11/18/2021 8:40:55 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE procedure [dbo].[giveRecommendation]
@requestor varchar(max),
@netID varchar(10),
@firstName varchar(max),
@lastName varchar(max),
@phone varchar(max),
@email varchar(max)
AS
if not exists(select * from Recommendation where RecommenderID = @requestor 
and RecommendedID = @netID)
BEGIN
Insert into Recommendation 
values 
(@requestor, @netID, @firstName,@lastName,@phone,@email, getdate())
END
ELSE
BEGIN
    RAISERROR ('Student already has a recommendation', -- Message text.  
               16, -- Severity.  
               1 -- State.  
               );
END
GO

/****** Object:  StoredProcedure [dbo].[removeAllocation]    Script Date: 11/18/2021 8:40:55 AM ******/
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

/****** Object:  StoredProcedure [dbo].[removeRecommendation]    Script Date: 11/18/2021 8:40:55 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


Create procedure [dbo].[removeRecommendation] 
@recommended varchar(max),
@recommender varchar(max)
AS
delete from Recommendation
where RecommenderID = @recommender
and RecommendedID = @recommended
GO

/****** Object:  StoredProcedure [dbo].[setAllocation]    Script Date: 11/18/2021 8:40:55 AM ******/
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
or RequestedID = @allocated

Insert into Allocation 
values 
(@allocated, @allocatedTo, getdate())

GO


