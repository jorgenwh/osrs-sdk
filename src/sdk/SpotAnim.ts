"use strict";

import { Location, Location3 } from "./Location";
import { Unit } from "./Unit";
import { Renderable } from "./Renderable";
import { GLTFModel } from "./rendering/GLTFModel";

export interface SpotAnimOptions {
  model: string;
  modelScale?: number;
  // Duration in ticks
  duration?: number;
  // Height offset from target
  heightOffset?: number;
  // If true, follows the target unit
  followTarget?: boolean;
}

/**
 * A spot animation (graphic) that plays at a location or on a unit.
 * Used for special attack effects, spell impacts, etc.
 */
export class SpotAnim extends Renderable {
  private age = 0;
  private options: Required<SpotAnimOptions>;
  private startLocation: Location;
  private target: Unit | null;

  constructor(
    target: Unit | Location,
    options: SpotAnimOptions,
  ) {
    super();

    this.options = {
      model: options.model,
      modelScale: options.modelScale ?? 1.0,
      duration: options.duration ?? 2,
      heightOffset: options.heightOffset ?? 0,
      followTarget: options.followTarget ?? true,
    };

    if (this.isUnit(target)) {
      this.target = target;
      this.startLocation = { x: target.location.x, y: target.location.y };
    } else {
      this.target = null;
      this.startLocation = { x: target.x, y: target.y };
    }
  }

  private isUnit(target: Unit | Location): target is Unit {
    return (target as Unit).location !== undefined;
  }

  onTick() {
    this.age++;
  }

  shouldDestroy(): boolean {
    return this.age >= this.options.duration;
  }

  visible(tickPercent: number): boolean {
    return this.age < this.options.duration;
  }

  getPerceivedLocation(tickPercent: number): Location3 {
    let x: number, y: number;

    if (this.target && this.options.followTarget) {
      const loc = this.target.getPerceivedLocation(tickPercent);
      x = loc.x;
      y = loc.y;
    } else {
      x = this.startLocation.x;
      y = this.startLocation.y;
    }

    const height = (this.target?.height ?? 1) * 0.5 + this.options.heightOffset;

    return { x, y, z: height };
  }

  getPerceivedRotation(tickPercent: number): number {
    if (this.target) {
      return this.target.getPerceivedRotation(tickPercent);
    }
    return 0;
  }

  getTrueLocation(): Location {
    return this.startLocation;
  }

  get size(): number {
    return 1;
  }

  get color(): string {
    return "#FFFFFF";
  }

  get drawOutline(): boolean {
    return false;
  }

  protected create3dModel() {
    return GLTFModel.forRenderable(this, this.options.model, {
      scale: this.options.modelScale,
    });
  }

  get animationIndex(): number {
    return 0;
  }
}
