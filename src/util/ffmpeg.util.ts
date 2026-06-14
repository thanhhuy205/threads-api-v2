
import { uploadDirToR2 } from '@/util/upload.util';
import { ffprobePath } from 'ffmpeg-ffprobe-static';
import ffmpegPath from 'ffmpeg-static';
import ffmpeg from 'fluent-ffmpeg';
import { unlink } from 'fs/promises';
import path from 'path';
if (!ffmpegPath || !ffprobePath) {
    throw new Error('FFmpeg or FFprobe path not found. Please ensure ffmpeg-static and ffmpeg-ffprobe-static are installed.');
}

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

async function generateThumbnail(filePath: string, outputDir: string) {
    return new Promise((resolve, reject) => {
        ffmpeg(filePath)
            .on('filenames', function (filenames) {
                console.log('Generating thumbnail:', filenames);
            })
            .on('end', function () {
                console.log('Thumbnail generation completed.');
            })
            .on('error', function (err) {
                console.error('Error generating thumbnail:', err);
                reject(err);
            })
            .screenshots({
                count: 1,
                folder: outputDir,
                filename: 'thumbnail.webp',
                size: '320x?',
            });
    });
}

export async function generateVideoSegments(filePath: string, outputDir: string, filename: string, outputCloudDir: string) {
    return new Promise((resolve, reject) => {
        ffmpeg(filePath)
            .on('filenames', function (filename) {
                console.log('Generating Video Segments:', filename);
            })
            .outputOptions([
                '-c:v libx264', // Specifies the H.264 video codec.
                '-c:a aac', // Specifies the AAC audio codec.
                '-preset medium', // Compression preset
                '-crf 24', // CRF for quality control (lower is better quality)
            ])
            .output(path.join(outputDir, "index.m3u8")) // Cần phải chỉ định thư mục đầu ra để ffmpeg tạo các segment ở đó
            .outputOptions([
                '-start_number 0', // Sets the starting number for the HLS segments.
                '-hls_time 4', // Duration of each HLS segment in seconds.
                '-hls_list_size 0', // Ensures all segments are included in the playlist.
                '-hls_playlist_type vod', // Designates the playlist as VOD and includes the EXT-X-ENDLIST tag.
                '-f hls', // Specifies the output format as HLS (HTTP Live Streaming).
                `-hls_segment_filename ${path.join(outputDir, 'segment%03d.ts')}`
            ])
            .on('end', async () => {
                await unlink(filePath);
                await uploadDirToR2(outputDir, outputCloudDir);
                console.log('Video segments generation completed.');
                return resolve(true);
            })
            .on('error', (err) => {
                console.error('FFmpeg error:', err);
                reject(err);
            })
            .on('stderr', (line) => console.error('FFmpeg stderr:', line)) // 
            .run();
    });
}