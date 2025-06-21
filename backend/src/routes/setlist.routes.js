const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();
const prisma = new PrismaClient();

/**
 * @route GET /api/setlists
 * @desc Get all setlists for the current user
 * @access Private
 */
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const setlists = await prisma.setlist.findMany({
      where: {
        OR: [
          { userId: req.user.id },
          {
            collaborators: {
              some: {
                userId: req.user.id
              }
            }
          }
        ]
      },
      include: {
        user: {
          select: {
            id: true,
            username: true
          }
        },
        _count: {
          select: { setlistSongs: true }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    res.json(setlists);
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /api/setlists
 * @desc Create a new setlist
 * @access Private
 */
router.post('/', authenticateToken, async (req, res, next) => {
  try {
    const { name, description, venue, eventDate, isPublic } = req.body;

    const setlist = await prisma.setlist.create({
      data: {
        name,
        description,
        venue,
        eventDate: eventDate ? new Date(eventDate) : null,
        isPublic: isPublic || false,
        user: {
          connect: { id: req.user.id }
        }
      }
    });

    res.status(201).json(setlist);
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /api/setlists/:id
 * @desc Get a setlist by ID
 * @access Private
 */
router.get('/:id', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const setlist = await prisma.setlist.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true
          }
        },
        setlistSongs: {
          include: {
            song: true
          },
          orderBy: {
            position: 'asc'
          }
        },
        collaborators: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true
              }
            }
          }
        }
      }
    });

    if (!setlist) {
      return res.status(404).json({ message: 'Setlist not found' });
    }

    // Check if the user has access to this setlist
    const isOwner = setlist.userId === req.user.id;
    const isCollaborator = setlist.collaborators.some(collab => collab.userId === req.user.id);
    const isPublic = setlist.isPublic;

    if (!isOwner && !isCollaborator && !isPublic) {
      return res.status(403).json({ message: 'You do not have permission to view this setlist' });
    }

    // Format the response
    const formattedSetlist = {
      ...setlist,
      songs: setlist.setlistSongs.map(setlistSong => ({
        ...setlistSong.song,
        position: setlistSong.position,
        keyOverride: setlistSong.keyOverride,
        durationOverride: setlistSong.durationOverride,
        notes: setlistSong.notes
      }))
    };
    
    // Remove the original setlistSongs array to clean up the response
    delete formattedSetlist.setlistSongs;

    res.json(formattedSetlist);
  } catch (error) {
    next(error);
  }
});

/**
 * @route PUT /api/setlists/:id
 * @desc Update a setlist
 * @access Private
 */
router.put('/:id', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, venue, eventDate, isPublic } = req.body;
    
    // Check if the setlist exists and the user has permission
    const existingSetlist = await prisma.setlist.findUnique({
      where: { id },
      include: {
        collaborators: {
          where: {
            userId: req.user.id,
            permissionLevel: {
              in: ['write', 'admin']
            }
          }
        }
      }
    });

    if (!existingSetlist) {
      return res.status(404).json({ message: 'Setlist not found' });
    }

    const isOwner = existingSetlist.userId === req.user.id;
    const hasWriteAccess = existingSetlist.collaborators.length > 0;

    if (!isOwner && !hasWriteAccess) {
      return res.status(403).json({ message: 'You do not have permission to update this setlist' });
    }

    // Update the setlist
    const updatedSetlist = await prisma.setlist.update({
      where: { id },
      data: {
        name,
        description,
        venue,
        eventDate: eventDate ? new Date(eventDate) : null,
        isPublic: isPublic || false,
        updatedAt: new Date()
      }
    });

    res.json(updatedSetlist);
  } catch (error) {
    next(error);
  }
});

/**
 * @route DELETE /api/setlists/:id
 * @desc Delete a setlist
 * @access Private
 */
router.delete('/:id', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Check if the setlist exists and the user is the owner
    const existingSetlist = await prisma.setlist.findUnique({
      where: { id }
    });

    if (!existingSetlist) {
      return res.status(404).json({ message: 'Setlist not found' });
    }

    if (existingSetlist.userId !== req.user.id) {
      return res.status(403).json({ message: 'You do not have permission to delete this setlist' });
    }

    // Delete the setlist (cascade will handle related setlistSongs)
    await prisma.setlist.delete({
      where: { id }
    });

    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /api/setlists/:id/songs
 * @desc Add a song to a setlist
 * @access Private
 */
router.post('/:id/songs', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { songId, position, keyOverride, durationOverride, notes } = req.body;
    
    // Check if the setlist exists and the user has permission
    const existingSetlist = await prisma.setlist.findUnique({
      where: { id },
      include: {
        collaborators: {
          where: {
            userId: req.user.id,
            permissionLevel: {
              in: ['write', 'admin']
            }
          }
        },
        setlistSongs: {
          orderBy: {
            position: 'desc'
          },
          take: 1
        }
      }
    });

    if (!existingSetlist) {
      return res.status(404).json({ message: 'Setlist not found' });
    }

    const isOwner = existingSetlist.userId === req.user.id;
    const hasWriteAccess = existingSetlist.collaborators.length > 0;

    if (!isOwner && !hasWriteAccess) {
      return res.status(403).json({ message: 'You do not have permission to modify this setlist' });
    }

    // Calculate position if not provided
    let songPosition = position;
    if (songPosition === undefined) {
      songPosition = existingSetlist.setlistSongs.length > 0 
        ? existingSetlist.setlistSongs[0].position + 1 
        : 0;
    }

    // Add the song to the setlist
    const setlistSong = await prisma.setlistSong.create({
      data: {
        setlist: {
          connect: { id }
        },
        song: {
          connect: { id: songId }
        },
        position: songPosition,
        keyOverride,
        durationOverride,
        notes
      },
      include: {
        song: true
      }
    });

    // Update the setlist's updatedAt timestamp
    await prisma.setlist.update({
      where: { id },
      data: { updatedAt: new Date() }
    });

    res.status(201).json({
      ...setlistSong.song,
      position: setlistSong.position,
      keyOverride: setlistSong.keyOverride,
      durationOverride: setlistSong.durationOverride,
      notes: setlistSong.notes
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route PUT /api/setlists/:id/songs/:songId
 * @desc Update a song in a setlist
 * @access Private
 */
router.put('/:id/songs/:songId', authenticateToken, async (req, res, next) => {
  try {
    const { id, songId } = req.params;
    const { keyOverride, durationOverride, notes } = req.body;
    
    // Check if the setlist exists and the user has permission
    const existingSetlist = await prisma.setlist.findUnique({
      where: { id },
      include: {
        collaborators: {
          where: {
            userId: req.user.id,
            permissionLevel: {
              in: ['write', 'admin']
            }
          }
        }
      }
    });

    if (!existingSetlist) {
      return res.status(404).json({ message: 'Setlist not found' });
    }

    const isOwner = existingSetlist.userId === req.user.id;
    const hasWriteAccess = existingSetlist.collaborators.length > 0;

    if (!isOwner && !hasWriteAccess) {
      return res.status(403).json({ message: 'You do not have permission to modify this setlist' });
    }

    // Update the setlist song
    const updatedSetlistSong = await prisma.setlistSong.update({
      where: {
        setlistId_songId: {
          setlistId: id,
          songId
        }
      },
      data: {
        keyOverride,
        durationOverride,
        notes,
        updatedAt: new Date()
      },
      include: {
        song: true
      }
    });

    // Update the setlist's updatedAt timestamp
    await prisma.setlist.update({
      where: { id },
      data: { updatedAt: new Date() }
    });

    res.json({
      ...updatedSetlistSong.song,
      position: updatedSetlistSong.position,
      keyOverride: updatedSetlistSong.keyOverride,
      durationOverride: updatedSetlistSong.durationOverride,
      notes: updatedSetlistSong.notes
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route DELETE /api/setlists/:id/songs/:songId
 * @desc Remove a song from a setlist
 * @access Private
 */
router.delete('/:id/songs/:songId', authenticateToken, async (req, res, next) => {
  try {
    const { id, songId } = req.params;
    
    // Check if the setlist exists and the user has permission
    const existingSetlist = await prisma.setlist.findUnique({
      where: { id },
      include: {
        collaborators: {
          where: {
            userId: req.user.id,
            permissionLevel: {
              in: ['write', 'admin']
            }
          }
        }
      }
    });

    if (!existingSetlist) {
      return res.status(404).json({ message: 'Setlist not found' });
    }

    const isOwner = existingSetlist.userId === req.user.id;
    const hasWriteAccess = existingSetlist.collaborators.length > 0;

    if (!isOwner && !hasWriteAccess) {
      return res.status(403).json({ message: 'You do not have permission to modify this setlist' });
    }

    // Get the current position of the song to be removed
    const setlistSongToRemove = await prisma.setlistSong.findUnique({
      where: {
        setlistId_songId: {
          setlistId: id,
          songId
        }
      }
    });

    if (!setlistSongToRemove) {
      return res.status(404).json({ message: 'Song not found in this setlist' });
    }

    // Remove the song from the setlist
    await prisma.setlistSong.delete({
      where: {
        setlistId_songId: {
          setlistId: id,
          songId
        }
      }
    });

    // Reorder the positions of remaining songs
    await prisma.$transaction(async (tx) => {
      const remainingSongs = await tx.setlistSong.findMany({
        where: {
          setlistId: id,
          position: {
            gt: setlistSongToRemove.position
          }
        },
        orderBy: {
          position: 'asc'
        }
      });

      for (const song of remainingSongs) {
        await tx.setlistSong.update({
          where: {
            id: song.id
          },
          data: {
            position: song.position - 1
          }
        });
      }

      // Update the setlist's updatedAt timestamp
      await tx.setlist.update({
        where: { id },
        data: { updatedAt: new Date() }
      });
    });

    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

/**
 * @route PUT /api/setlists/:id/songs/reorder
 * @desc Reorder songs in a setlist
 * @access Private
 */
router.put('/:id/songs/reorder', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { songOrders } = req.body;
    
    if (!songOrders || !Array.isArray(songOrders)) {
      return res.status(400).json({ message: 'Invalid song order data' });
    }

    // Check if the setlist exists and the user has permission
    const existingSetlist = await prisma.setlist.findUnique({
      where: { id },
      include: {
        collaborators: {
          where: {
            userId: req.user.id,
            permissionLevel: {
              in: ['write', 'admin']
            }
          }
        }
      }
    });

    if (!existingSetlist) {
      return res.status(404).json({ message: 'Setlist not found' });
    }

    const isOwner = existingSetlist.userId === req.user.id;
    const hasWriteAccess = existingSetlist.collaborators.length > 0;

    if (!isOwner && !hasWriteAccess) {
      return res.status(403).json({ message: 'You do not have permission to modify this setlist' });
    }

    // Update each song's position
    await prisma.$transaction(
      songOrders.map(({ songId, position }) => 
        prisma.setlistSong.update({
          where: {
            setlistId_songId: {
              setlistId: id,
              songId
            }
          },
          data: { position }
        })
      )
    );

    // Update the setlist's updatedAt timestamp
    await prisma.setlist.update({
      where: { id },
      data: { updatedAt: new Date() }
    });

    // Get the updated setlist
    const updatedSetlist = await prisma.setlist.findUnique({
      where: { id },
      include: {
        setlistSongs: {
          include: {
            song: true
          },
          orderBy: {
            position: 'asc'
          }
        }
      }
    });

    // Format the response
    const formattedSetlist = {
      ...updatedSetlist,
      songs: updatedSetlist.setlistSongs.map(setlistSong => ({
        ...setlistSong.song,
        position: setlistSong.position,
        keyOverride: setlistSong.keyOverride,
        durationOverride: setlistSong.durationOverride,
        notes: setlistSong.notes
      }))
    };
    
    delete formattedSetlist.setlistSongs;

    res.json(formattedSetlist);
  } catch (error) {
    next(error);
  }
});

module.exports = router;