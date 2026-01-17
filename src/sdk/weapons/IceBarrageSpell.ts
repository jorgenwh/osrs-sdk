import type { Unit } from "../Unit";
import { BarrageSpell } from "./BarrageSpell";
import { ProjectileOptions } from "./Projectile";
import { AttackBonuses } from "../gear/Weapon";
import { ItemName } from "../ItemName";
import { Sound, SoundCache } from "../utils/SoundCache";
import { Assets } from "../utils/Assets";
import IceBarrageSound from "../../assets/sounds/ice_barrage.ogg"

export class IceBarrageSpell extends BarrageSpell {
  private static ProjectileModel = Assets.getAssetUrl("models/ice_barrage_projectile.glb");
  private static ImpactModel = Assets.getAssetUrl("models/ice_barrage_impact.glb");

  constructor(projectileRules?: ProjectileOptions) {
    super({
      ...projectileRules,
      impactModel: IceBarrageSpell.ImpactModel,
      impactModelScale: 1 / 128,
      impactDuration: 3,
    });
    SoundCache.preload(this.attackSound.src);
  }

  override get attackSound() {
    return new Sound(IceBarrageSound, 0.1);
  }

  get itemName(): ItemName {
    return ItemName.ICE_BARRAGE;
  }

  override get projectileModel(): string {
    return IceBarrageSpell.ProjectileModel;
  }

  attack(from: Unit, to: Unit, bonuses: AttackBonuses = {}, options: ProjectileOptions = {}): boolean {
    super.attack(from, to, bonuses, options);
    if (this.lastHitHit) {
      to.freeze(32);
    }
    return true;
  }
}
