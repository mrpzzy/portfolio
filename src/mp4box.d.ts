declare module "mp4box" {
  export interface MP4ArrayBuffer extends ArrayBuffer {
    fileStart: number;
  }

  export interface MP4VideoTrack {
    id: number;
    codec: string;
    timescale: number;
    duration: number;
    nb_samples: number;
    video?: { width: number; height: number };
  }

  export interface MP4Info {
    duration: number;
    timescale: number;
    videoTracks: MP4VideoTrack[];
    tracks: MP4VideoTrack[];
  }

  export interface MP4Sample {
    number: number;
    is_sync: boolean;
    cts: number;
    dts: number;
    duration: number;
    timescale: number;
    data: Uint8Array;
  }

  export interface MP4File {
    onReady: (info: MP4Info) => void;
    onError: (e: string) => void;
    onSamples: (id: number, user: unknown, samples: MP4Sample[]) => void;
    appendBuffer(data: MP4ArrayBuffer): number;
    start(): void;
    stop(): void;
    flush(): void;
    setExtractionOptions(
      id: number,
      user?: unknown,
      options?: { nbSamples?: number },
    ): void;
    getTrackById(id: number): {
      mdia?: {
        minf?: {
          stbl?: {
            stsd?: {
              entries?: Array<{
                avcC?: unknown;
                hvcC?: unknown;
                vpcC?: unknown;
                av1C?: unknown;
              }>;
            };
          };
        };
      };
    };
  }

  export function createFile(): MP4File;

  export class DataStream {
    static BIG_ENDIAN: number;
    static LITTLE_ENDIAN: number;
    constructor(
      arrayBuffer?: ArrayBuffer,
      byteOffset?: number,
      endianness?: number,
    );
    buffer: ArrayBuffer;
    endianness: number;
  }

  const MP4Box: {
    createFile: typeof createFile;
    DataStream: typeof DataStream;
  };
  export default MP4Box;
}
