import { AttackStyle, AttackStyleTypes } from "../../sdk/AttackStylesController";
import { AttackBonuses } from "../../sdk/gear/Weapon";
import { ItemName } from "../../sdk/ItemName";
import { PlayerAnimationIndices } from "../../sdk/rendering/GLTFAnimationConstants";
import { SpotAnim } from "../../sdk/SpotAnim";
import { Unit } from "../../sdk/Unit";
import { Assets } from "../../sdk/utils/Assets";
import { Sound } from "../../sdk/utils/SoundCache";
import { MeleeWeapon } from "../../sdk/weapons/MeleeWeapon";

import ScytheAttackSound from "../../assets/sounds/scythe_swing_2524.ogg";
import ArmadylGodswordImage from "../../assets/images/weapons/Armadyl_godsword.png";

export class ArmadylGodsword extends MeleeWeapon {
  constructor() {
    super();

    this.bonuses = {
      attack: {
        stab: 0,
        slash: 132,
        crush: 80,
        magic: 0,
        range: 0,
      },
      defence: {
        stab: 0,
        slash: 0,
        crush: 0,
        magic: 0,
        range: 0,
      },
      other: {
        meleeStrength: 132,
        rangedStrength: 0,
        magicDamage: 0,
        prayer: 8,
      },
      targetSpecific: {
        undead: 0,
        slayer: 0,
      },
    };
  }

  get weight(): number {
    return 10.0;
  }

  attackStyles() {
    return [AttackStyle.ACCURATE, AttackStyle.AGGRESSIVESLASH, AttackStyle.AGGRESSIVECRUSH, AttackStyle.DEFENSIVE];
  }

  attackStyleCategory(): AttackStyleTypes {
    return AttackStyleTypes.SLASHSWORD;
  }

  defaultStyle(): AttackStyle {
    return AttackStyle.AGGRESSIVESLASH;
  }

  get itemName(): ItemName {
    return ItemName.ARMADYL_GODSWORD;
  }

  get isTwoHander(): boolean {
    return true;
  }

  hasSpecialAttack(): boolean {
    return true;
  }

  get attackRange() {
    return 1;
  }

  get attackSpeed() {
    return 6;
  }

  get inventoryImage() {
    return ArmadylGodswordImage;
  }

  get attackSound() {
    return new Sound(ScytheAttackSound, 0.1);
  }

  private Model = Assets.getAssetUrl("models/player_armadyl_godsword.glb");
  override get model() {
    return this.Model;
  }

  override get attackAnimationId() {
    return PlayerAnimationIndices.GodswordSlash;
  }

  override get specialAttackAnimationId() {
    return PlayerAnimationIndices.AgsSpecialAttack;
  }

  override get idleAnimationId() {
    return PlayerAnimationIndices.GodswordIdle;
  }

  override get walkAnimationId() {
    return PlayerAnimationIndices.GodswordWalk;
  }

  override get runAnimationId() {
    return PlayerAnimationIndices.GodswordRun;
  }

  private SpecialEffectModel = Assets.getAssetUrl("models/ags_special_effect.glb");

  specialAttack(from: Unit, to: Unit, bonuses: AttackBonuses = {}) {
    bonuses.isSpecialAttack = true;
    super.attack(from, to, bonuses);

    // Spawn the AGS special attack effect on the target
    const spotAnim = new SpotAnim(to, {
      model: this.SpecialEffectModel,
      modelScale: 1 / 128,
      duration: 2,
      heightOffset: 0.5,
      followTarget: true,
    });
    from.region.addSpotAnim(spotAnim);
  }

  // AGS special: floor(base * 1.1) * 1.25 = 37.5% more damage with integer rounding
  override _maxHit(from: Unit, to: Unit, bonuses: AttackBonuses) {
    const baseMaxHit = super._maxHit(from, to, bonuses);
    if (bonuses.isSpecialAttack) {
      // Hidden 110% godsword bonus, floored, then 125% multiplier
      return Math.floor(Math.floor(baseMaxHit * 1.1) * 1.25);
    }
    return baseMaxHit;
  }

  // AGS special: 2x accuracy (doubled accuracy roll)
  override _attackRoll(from: Unit, to: Unit, bonuses: AttackBonuses) {
    const baseAttackRoll = super._attackRoll(from, to, bonuses);
    if (bonuses.isSpecialAttack) {
      return baseAttackRoll * 2;
    }
    return baseAttackRoll;
  }
}
