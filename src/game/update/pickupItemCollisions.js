import { playEffect } from "../../game/util";
import { effects } from "../../enums/effects";
import { items } from "../../enums/items";
import { ItemWarp } from "../../game/Items/itemWarp";

const handlePickupItemCollisions = (player, itemManager, gameManager) => {
    game.physics.arcade.overlap(
        player.sprite,
        itemManager.activeItems,
        (_, item) => {
            playEffect(effects.DIE, item.x, item.y);

            switch (item.data.type) {
                case items.DEATH:
                    console.log(`TODO: Player ${player.id} hit skull`);
                    //gm->playerSkulled(other);
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
                    break;
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

            item.destroy();
        }
    );
};

export { handlePickupItemCollisions };
