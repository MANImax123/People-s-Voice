import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Program from '@/models/Program';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const program = await Program.findById(params.id);

    if (!program) {
      return NextResponse.json(
        { error: 'Program not found' },
        { status: 404 }
      );
    }

    // Increment view count
    await Program.findByIdAndUpdate(params.id, {
      $inc: { viewsCount: 1 }
    });

    return NextResponse.json({
      success: true,
      program
    });

  } catch (error: any) {
    console.error('Get program error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch program' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const { action, userEmail, userName, userId, commentText, commentId } = await req.json();

    if (!userEmail || !userName) {
      return NextResponse.json(
        { error: 'User information required' },
        { status: 400 }
      );
    }

    const program = await Program.findById(params.id);
    if (!program) {
      return NextResponse.json(
        { error: 'Program not found' },
        { status: 404 }
      );
    }

    switch (action) {
      case 'like':
        // Remove from dislikes if exists
        program.dislikes = program.dislikes.filter((d: any) => d.userEmail !== userEmail);
        
        // Check if already liked
        const existingLike = program.likes.find((l: any) => l.userEmail === userEmail);
        if (existingLike) {
          // Remove like
          program.likes = program.likes.filter((l: any) => l.userEmail !== userEmail);
        } else {
          // Add like
          program.likes.push({
            userId: userId || userEmail,
            userEmail,
            userName,
            likedAt: new Date()
          });
        }
        
        program.likesCount = program.likes.length;
        program.dislikesCount = program.dislikes.length;
        break;

      case 'dislike':
        // Remove from likes if exists
        program.likes = program.likes.filter((l: any) => l.userEmail !== userEmail);
        
        // Check if already disliked
        const existingDislike = program.dislikes.find((d: any) => d.userEmail === userEmail);
        if (existingDislike) {
          // Remove dislike
          program.dislikes = program.dislikes.filter((d: any) => d.userEmail !== userEmail);
        } else {
          // Add dislike
          program.dislikes.push({
            userId: userId || userEmail,
            userEmail,
            userName,
            dislikedAt: new Date()
          });
        }
        
        program.likesCount = program.likes.length;
        program.dislikesCount = program.dislikes.length;
        break;

      case 'comment':
        if (!commentText || commentText.trim().length === 0) {
          return NextResponse.json(
            { error: 'Comment text is required' },
            { status: 400 }
          );
        }

        const newComment = {
          userId: userId || userEmail,
          userEmail,
          userName,
          text: commentText.trim(),
          likes: [],
          likesCount: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        program.comments.push(newComment);
        program.commentsCount = program.comments.length;
        break;

      case 'likeComment':
        if (!commentId) {
          return NextResponse.json(
            { error: 'Comment ID is required' },
            { status: 400 }
          );
        }

        const comment = program.comments.id(commentId);
        if (!comment) {
          return NextResponse.json(
            { error: 'Comment not found' },
            { status: 404 }
          );
        }

        const existingCommentLike = comment.likes.find((l: any) => l.userEmail === userEmail);
        if (existingCommentLike) {
          // Remove like
          comment.likes = comment.likes.filter((l: any) => l.userEmail !== userEmail);
        } else {
          // Add like
          comment.likes.push({
            userId: userId || userEmail,
            userEmail,
            userName,
            likedAt: new Date()
          });
        }
        
        comment.likesCount = comment.likes.length;
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    await program.save();

    return NextResponse.json({
      success: true,
      message: `${action} successful`,
      program: {
        _id: program._id,
        likesCount: program.likesCount,
        dislikesCount: program.dislikesCount,
        commentsCount: program.commentsCount,
        userLiked: program.likes.some((l: any) => l.userEmail === userEmail),
        userDisliked: program.dislikes.some((d: any) => d.userEmail === userEmail)
      }
    });

  } catch (error: any) {
    console.error('Program action error:', error);
    return NextResponse.json(
      { error: 'Failed to perform action' },
      { status: 500 }
    );
  }
}
