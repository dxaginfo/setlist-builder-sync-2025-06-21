import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { 
  Box, 
  Paper, 
  Typography, 
  Button, 
  IconButton, 
  TextField, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Chip
} from '@mui/material';
import { 
  Add as AddIcon, 
  Delete as DeleteIcon, 
  Edit as EditIcon, 
  DragHandle as DragHandleIcon,
  MusicNote as MusicNoteIcon,
  AccessTime as AccessTimeIcon,
  Save as SaveIcon
} from '@mui/icons-material';

// Types
interface Song {
  id: string;
  title: string;
  artist?: string;
  key?: string;
  durationSeconds?: number;
}

interface SetlistSong extends Song {
  position: number;
  keyOverride?: string;
  durationOverride?: number;
  notes?: string;
}

interface Setlist {
  id: string;
  name: string;
  description?: string;
  venue?: string;
  eventDate?: string;
  songs: SetlistSong[];
}

// Helper functions
const formatDuration = (seconds: number | undefined): string => {
  if (!seconds) return '--:--';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? '0' + secs : secs}`;
};

const calculateTotalDuration = (songs: SetlistSong[]): number => {
  return songs.reduce((total, song) => {
    return total + (song.durationOverride || song.durationSeconds || 0);
  }, 0);
};

const SetlistEditor: React.FC<{ setlistId: string }> = ({ setlistId }) => {
  // State
  const [setlist, setSetlist] = useState<Setlist | null>(null);
  const [availableSongs, setAvailableSongs] = useState<Song[]>([]);
  const [editingSong, setEditingSong] = useState<SetlistSong | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Mock data for development
  useEffect(() => {
    // This would be replaced with an API call in production
    setTimeout(() => {
      const mockSetlist: Setlist = {
        id: setlistId,
        name: 'Summer Tour 2025',
        description: 'Main setlist for summer festival tour',
        venue: 'Various venues',
        eventDate: '2025-07-01',
        songs: [
          { 
            id: '1', 
            title: 'Opening Number', 
            artist: 'Our Band', 
            key: 'C', 
            durationSeconds: 240, 
            position: 0 
          },
          { 
            id: '2', 
            title: 'Big Hit', 
            artist: 'Our Band', 
            key: 'G', 
            durationSeconds: 180, 
            position: 1,
            notes: 'Extended outro on festivals'
          },
          { 
            id: '3', 
            title: 'Slow Ballad', 
            artist: 'Our Band', 
            key: 'D', 
            durationSeconds: 210, 
            position: 2 
          }
        ]
      };
      
      const mockAvailableSongs: Song[] = [
        { id: '4', title: 'New Song', artist: 'Our Band', key: 'A', durationSeconds: 200 },
        { id: '5', title: 'Cover Song', artist: 'Famous Artist', key: 'E', durationSeconds: 190 },
        { id: '6', title: 'Deep Cut', artist: 'Our Band', key: 'Bm', durationSeconds: 300 }
      ];
      
      setSetlist(mockSetlist);
      setAvailableSongs(mockAvailableSongs);
      setIsLoading(false);
    }, 500);
  }, [setlistId]);
  
  // Event handlers
  const handleDragEnd = (result: any) => {
    if (!result.destination || !setlist) return;
    
    const items = Array.from(setlist.songs);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    // Update positions
    const updatedSongs = items.map((song, index) => ({
      ...song,
      position: index
    }));
    
    setSetlist({
      ...setlist,
      songs: updatedSongs
    });
  };
  
  const handleAddSong = (song: Song) => {
    if (!setlist) return;
    
    const newSetlistSong: SetlistSong = {
      ...song,
      position: setlist.songs.length
    };
    
    setSetlist({
      ...setlist,
      songs: [...setlist.songs, newSetlistSong]
    });
  };
  
  const handleRemoveSong = (songId: string) => {
    if (!setlist) return;
    
    const updatedSongs = setlist.songs
      .filter(song => song.id !== songId)
      .map((song, index) => ({
        ...song,
        position: index
      }));
    
    setSetlist({
      ...setlist,
      songs: updatedSongs
    });
  };
  
  const handleEditSong = (song: SetlistSong) => {
    setEditingSong(song);
    setIsDialogOpen(true);
  };
  
  const handleSaveEdit = () => {
    if (!setlist || !editingSong) return;
    
    const updatedSongs = setlist.songs.map(song => 
      song.id === editingSong.id ? editingSong : song
    );
    
    setSetlist({
      ...setlist,
      songs: updatedSongs
    });
    
    setIsDialogOpen(false);
    setEditingSong(null);
  };
  
  const handleSaveSetlist = () => {
    // This would send an API request to save the setlist
    console.log('Saving setlist:', setlist);
    alert('Setlist saved successfully!');
  };
  
  if (isLoading) return <Typography>Loading setlist...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!setlist) return <Typography>No setlist found</Typography>;
  
  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4">{setlist.name}</Typography>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<SaveIcon />}
            onClick={handleSaveSetlist}
          >
            Save Setlist
          </Button>
        </Box>
        
        {setlist.description && (
          <Typography variant="body1" sx={{ mb: 1 }}>{setlist.description}</Typography>
        )}
        
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          {setlist.venue && (
            <Typography variant="body2">Venue: {setlist.venue}</Typography>
          )}
          {setlist.eventDate && (
            <Typography variant="body2">Date: {setlist.eventDate}</Typography>
          )}
          <Typography variant="body2">
            Total Duration: {formatDuration(calculateTotalDuration(setlist.songs))}
          </Typography>
        </Box>
      </Paper>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Songs</Typography>
        
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="setlist">
            {(provided) => (
              <List {...provided.droppableProps} ref={provided.innerRef}>
                {setlist.songs.length === 0 ? (
                  <Typography variant="body2" sx={{ textAlign: 'center', py: 2 }}>
                    No songs in this setlist. Add songs from the library below.
                  </Typography>
                ) : (
                  setlist.songs.map((song, index) => (
                    <Draggable key={song.id} draggableId={song.id} index={index}>
                      {(provided) => (
                        <ListItem
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          sx={{ 
                            mb: 1, 
                            border: '1px solid #eee', 
                            borderRadius: 1,
                            bgcolor: 'background.paper' 
                          }}
                        >
                          <Box 
                            {...provided.dragHandleProps} 
                            sx={{ mr: 1, display: 'flex', alignItems: 'center' }}
                          >
                            <DragHandleIcon color="action" />
                          </Box>
                          
                          <ListItemText 
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography variant="subtitle1">
                                  {index + 1}. {song.title}
                                </Typography>
                                {song.keyOverride && (
                                  <Chip 
                                    size="small" 
                                    label={`Key: ${song.keyOverride}`} 
                                    sx={{ ml: 1 }}
                                  />
                                )}
                              </Box>
                            }
                            secondary={
                              <Box>
                                <Typography variant="body2" component="span">
                                  {song.artist}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                  {song.key && !song.keyOverride && (
                                    <Typography variant="body2" component="span" sx={{ mr: 2 }}>
                                      <MusicNoteIcon fontSize="small" sx={{ fontSize: 14, mr: 0.5 }} />
                                      Key: {song.key}
                                    </Typography>
                                  )}
                                  <Typography variant="body2" component="span">
                                    <AccessTimeIcon fontSize="small" sx={{ fontSize: 14, mr: 0.5 }} />
                                    {formatDuration(song.durationOverride || song.durationSeconds)}
                                  </Typography>
                                </Box>
                                {song.notes && (
                                  <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
                                    Notes: {song.notes}
                                  </Typography>
                                )}
                              </Box>
                            }
                          />
                          
                          <ListItemSecondaryAction>
                            <IconButton edge="end" onClick={() => handleEditSong(song)}>
                              <EditIcon />
                            </IconButton>
                            <IconButton edge="end" onClick={() => handleRemoveSong(song.id)}>
                              <DeleteIcon />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      )}
                    </Draggable>
                  ))
                )}
                {provided.placeholder}
              </List>
            )}
          </Droppable>
        </DragDropContext>
      </Paper>
      
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Song Library</Typography>
        <List>
          {availableSongs.map((song) => (
            <ListItem key={song.id} sx={{ border: '1px solid #eee', mb: 1, borderRadius: 1 }}>
              <ListItemText 
                primary={song.title}
                secondary={
                  <Box>
                    <Typography variant="body2">{song.artist}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                      {song.key && (
                        <Typography variant="body2" component="span" sx={{ mr: 2 }}>
                          <MusicNoteIcon fontSize="small" sx={{ fontSize: 14, mr: 0.5 }} />
                          Key: {song.key}
                        </Typography>
                      )}
                      <Typography variant="body2" component="span">
                        <AccessTimeIcon fontSize="small" sx={{ fontSize: 14, mr: 0.5 }} />
                        {formatDuration(song.durationSeconds)}
                      </Typography>
                    </Box>
                  </Box>
                }
              />
              <Button 
                variant="outlined" 
                size="small" 
                startIcon={<AddIcon />}
                onClick={() => handleAddSong(song)}
              >
                Add to Setlist
              </Button>
            </ListItem>
          ))}
        </List>
      </Paper>
      
      {/* Edit Song Dialog */}
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Song in Setlist</DialogTitle>
        <DialogContent>
          {editingSong && (
            <Box sx={{ pt: 1 }}>
              <Typography variant="h6">{editingSong.title}</Typography>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>{editingSong.artist}</Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2">Original Key: {editingSong.key || 'Not specified'}</Typography>
                <TextField
                  label="Key Override"
                  fullWidth
                  margin="normal"
                  value={editingSong.keyOverride || ''}
                  onChange={(e) => setEditingSong({
                    ...editingSong,
                    keyOverride: e.target.value
                  })}
                  placeholder="Leave empty to use original key"
                />
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2">
                  Original Duration: {formatDuration(editingSong.durationSeconds)}
                </Typography>
                <TextField
                  label="Duration Override (seconds)"
                  fullWidth
                  margin="normal"
                  type="number"
                  value={editingSong.durationOverride || ''}
                  onChange={(e) => setEditingSong({
                    ...editingSong,
                    durationOverride: e.target.value ? parseInt(e.target.value) : undefined
                  })}
                  placeholder="Leave empty to use original duration"
                />
              </Box>
              
              <TextField
                label="Performance Notes"
                fullWidth
                margin="normal"
                multiline
                rows={3}
                value={editingSong.notes || ''}
                onChange={(e) => setEditingSong({
                  ...editingSong,
                  notes: e.target.value
                })}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleSaveEdit}>Save Changes</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SetlistEditor;