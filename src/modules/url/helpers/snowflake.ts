import { env } from "../../../config";
import { CustomError } from "../../../shared";

class SnowflakeGenerator {
  private static instance: SnowflakeGenerator;

  private readonly EPOCH: bigint;

  private readonly MACHINE_ID_BITS: bigint;
  private readonly MAX_MACHINE_ID: bigint;

  private readonly SEQUENCE_BITS: bigint;
  private readonly MAX_SEQUENCE: bigint;

  private readonly machineId: bigint;
  private sequence: bigint;
  private lastTimestamp: bigint;

  private constructor() {
    this.EPOCH           = 1704067200000n; // 1 Ene 2024
    this.MACHINE_ID_BITS = 10n;
    this.SEQUENCE_BITS   = 12n;
    this.MAX_SEQUENCE    = (1n << this.SEQUENCE_BITS) - 1n;
    this.MAX_MACHINE_ID  = (1n << this.MACHINE_ID_BITS) - 1n;

    const machineId = BigInt(env.MACHINE_ID || 0);

    if (machineId < 0n || machineId > this.MAX_MACHINE_ID) {
      throw CustomError.internalServer('Invalid machine ID configuration');
    }

    this.machineId     = machineId;
    this.sequence      = 0n;
    this.lastTimestamp = -1n;
  }

  static getInstance(): SnowflakeGenerator {
    if (!SnowflakeGenerator.instance) {
      SnowflakeGenerator.instance = new SnowflakeGenerator();
    }
    return SnowflakeGenerator.instance;
  }

  #now(): bigint {
    return BigInt(Date.now());
  }

  #waitNextMillis(last: bigint): bigint {
    let ts = this.#now();
    while (ts <= last) ts = this.#now();
    return ts;
  }

  generateId(): bigint {
    let timestamp = this.#now();

    if (timestamp < this.lastTimestamp) {
      throw CustomError.internalServer('Clock drift detected');
    }

    if (timestamp === this.lastTimestamp) {
      this.sequence = (this.sequence + 1n) & this.MAX_SEQUENCE;
      if (this.sequence === 0n) {
        timestamp = this.#waitNextMillis(this.lastTimestamp);
      }
    } else {
      this.sequence = 0n;
    }

    this.lastTimestamp = timestamp;

    return (
      ((timestamp - this.EPOCH) << (this.MACHINE_ID_BITS + this.SEQUENCE_BITS)) |
      (this.machineId           << this.SEQUENCE_BITS) |
      this.sequence
    )
  }
}


export const snowflakeGenerator = SnowflakeGenerator.getInstance();
