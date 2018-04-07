import { playEffect } from "../../game/util";
import { effects } from "../../enums/effects";
import { items } from "../../enums/items";
import { deaths } from "../../enums/deaths";
import { ItemVolts } from "../../game/Items/itemVolts";
import { ItemInvisibility } from "../../game/Items/itemInvisibility";
import { ItemMine } from "../../game/Items/itemMine";
import { ItemGun } from "../../game/Items/itemGun";
import { ItemBoots } from "../../game/Items/itemBoots";
import { ItemGrenade } from "../../game/Items/itemGrenade";
import { ItemPuck } from "../../game/Items/itemPuck";
import { ItemChute } from "../../game/Items/itemChute";
import { ItemHook } from "../../game/Items/itemHook";

const handlePickupItemCollisions = (
    player,
    level,
    itemManager,
    gameManager
) => {
    game.physics.arcade.overlap(
        player.sprite,
        itemManager.activeItems,
        (_, item) => {
            switch (item.data.type) {
                case items.DEATH:
                    player.clearItem();
                    gameManager.killPlayer(player, deaths.SKULL);
                    break;
                case items.VOLTS:
                    player.setItem(new ItemVolts(player));
                    break;
                case items.INVISIBILITY:
                    player.setItem(new ItemInvisibility(player));
                    break;
                case items.MINE:
                    player.setItem(new ItemMine(player));
                    break;
                case items.GUN:
                    player.setItem(new ItemGun(player));
                    break;
                case items.TNT:
                    return;
                case items.BOOTS:
                    player.setItem(new ItemBoots(player));
                    break;
                case items.GRENADE:
                    player.setItem(new ItemGrenade(player));
                    break;
                case items.PUCK:
                    player.setItem(new ItemPuck(player));
                    break;
                case items.CHUTE:
                    player.setItem(new ItemChute(player));
                    break;
                case items.HOOK:
                    player.setItem(new ItemHook(player));
                    break;
                case items.WARP:
                    player.clearItem();
                    gameManager.warpPlayer(player);
                    break;
                default:
                    player.clearItem();
                    break;
            }

            playEffect(effects.DIE, item.x, item.y);
            item.destroy();
        }
    );

    itemManager.activeItems.forEach(item => {
        if (item.data.type !== items.TNT) {
            return;
        }

        if (gameManager.collideWithPlatforms(item, true)) {
            item.kill();
        }
    });
};

export { handlePickupItemCollisions };
