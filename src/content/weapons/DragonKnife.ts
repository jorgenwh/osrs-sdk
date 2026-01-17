import { RangedWeapon } from "../../sdk/weapons/RangedWeapon";
import { ItemName } from "../../sdk/ItemName";
import { Unit } from "../../sdk/Unit";
import { AttackBonuses } from "../../sdk/gear/Weapon";
import { AttackStyle, AttackStyleTypes } from "../../sdk/AttackStylesController";
import { ArcProjectileMotionInterpolator, ProjectileOptions } from "../../sdk/weapons/Projectile";
import { PlayerAnimationIndices } from "../../sdk/rendering/GLTFAnimationConstants";
import { Assets } from "../../sdk/utils/Assets";
import { Sound } from "../../sdk/utils/SoundCache";

import KnifeThrowSound from "../../assets/sounds/dart_2696.ogg";
import DragonKnifeInventImage from "../../assets/images/weapons/dragon_knife.png";

export class DragonKnife extends RangedWeapon {
  constructor() {
    super({
      modelScale: 1 / 128,
      visualDelayTicks: 1,
      visualHitEarlyTicks: 0,
      verticalOffset: -0.75,
      motionInterpolator: new ArcProjectileMotionInterpolator(0.3),
    });
    this.bonuses = {
      attack: {
        stab: 0,
        slash: 0,
        crush: 0,
        magic: 0,
        range: 28,
      },
      defence: {
        stab: 0,
        slash: 0,
        crush: 0,
        magic: 0,
        range: 0,
      },
      other: {
        meleeStrength: 0,
        rangedStrength: 30,
        magicDamage: 0,
        prayer: 0,
      },
      targetSpecific: {
        undead: 0,
        slayer: 0,
      },
    };
  }

  calculateHitDelay(distance: number) {
    return Math.floor(distance / 6) + 1;
  }

  attackStyles() {
    return [AttackStyle.ACCURATE, AttackStyle.RAPID, AttackStyle.LONGRANGE];
  }

  attackStyleCategory(): AttackStyleTypes {
    return AttackStyleTypes.THROWN;
  }

  defaultStyle(): AttackStyle {
    return AttackStyle.RAPID;
  }

  get attackRange() {
    if (this.attackStyle() === AttackStyle.LONGRANGE) {
      return 6;
    }
    return 4;
  }

  get attackSpeed() {
    if (this.attackStyle() === AttackStyle.RAPID) {
      return 2;
    }
    return 3;
  }

  get weight(): number {
    return 0;
  }

  get itemName(): ItemName {
    return ItemName.DRAGON_KNIFE;
  }

  get isTwoHander(): boolean {
    return false;
  }

  get inventoryImage() {
    return DragonKnifeInventImage;
  }

  hasSpecialAttack(): boolean {
    return true;
  }

  specialAttackDrain(): number {
    return 25;
  }

  // Dragon knife special: "Duality" - throws two knives at once
  // Each knife has its own accuracy and damage roll (no multipliers)
  specialAttack(from: Unit, to: Unit, bonuses: AttackBonuses = {}, options: ProjectileOptions = {}) {
    bonuses.isSpecialAttack = true;
    // First knife
    super.attack(from, to, bonuses, options);
    // Second knife (separate accuracy/damage roll)
    super.attack(from, to, bonuses, options);
  }

  get attackSound() {
    return new Sound(KnifeThrowSound, 0.1);
  }

  Model = Assets.getAssetUrl("models/player_dragon_knife.glb");
  override get model() {
    return this.Model;
  }

  get attackAnimationId() {
    return PlayerAnimationIndices.ThrowKnife;
  }

  ProjectileModel = Assets.getAssetUrl("models/dragon_knife_projectile.glb");
  get projectileModel() {
    return this.ProjectileModel;
  }
}
