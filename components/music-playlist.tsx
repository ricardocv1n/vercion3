"use client"

import { Play, Pause } from "lucide-react"
import type { Song } from "./music-player"

interface MusicPlaylistProps {
  songs: Song[]
  currentSongIndex: number
  isPlaying: boolean
  onSelectSong: (index: number) => void
}

export default function MusicPlaylist({ songs, currentSongIndex, isPlaying, onSelectSong }: MusicPlaylistProps) {
  return (
    <div className="overflow-y-auto max-h-64 pr-2 custom-scrollbar">
      <ul className="space-y-1">
        {songs.map((song, index) => (
          <li
            key={song.id}
            className={`
              flex items-center p-2 rounded-lg cursor-pointer transition-colors
              ${currentSongIndex === index ? "bg-pink-100 text-pink-800" : "hover:bg-gray-100"}
            `}
            onClick={() => onSelectSong(index)}
          >
            <div className="w-8 h-8 flex items-center justify-center mr-3">
              {currentSongIndex === index ? (
                isPlaying ? (
                  <Pause className="h-5 w-5 text-pink-600" />
                ) : (
                  <Play className="h-5 w-5 text-pink-600" />
                )
              ) : (
                <div className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center">
                  <span className="text-xs text-gray-500">{index + 1}</span>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`font-medium truncate ${currentSongIndex === index ? "text-pink-800" : "text-gray-800"}`}>
                {song.title}
              </p>
              <p className="text-sm text-gray-500 truncate">{song.artist}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
