import { Op } from 'sequelize';

import Logger from '../loaders/logger';
import db from '../models';

const Friend = db.friend;
const User = db.user;

const getFriendList = async (userEmail, callback) => {
    await Friend.findAll({ where: { user_email: userEmail } })
        .then(async (result) => {
            const friendEmails = result.map((r) => r.friendEmail);

            const friends = await User.findAll({
                attributes: ['user_id', 'email', 'nickname', 'profile_img'],
                where: { email: { [Op.in]: friendEmails } },
            });

            Logger.info(`Success! ${friends}`);
            callback(null, friends);
        })
        .catch((err) => {
            Logger.error(err);
            return callback(err);
        });
};

const deleteFriend = async (deleteEmail, callback) => {
    console.log(deleteEmail[0], deleteEmail[1]);

    // await Friend.findAll({ where: { user_email: deleteEmail[0] } })
    //     .then(async (result) => {
    //         Logger.info(`Success! ${result}`);
    //         callback(null, 'DELETE FRIEND OK');
    //     })
    //     .catch((err) => {
    //         Logger.error(err);
    //         return callback(err);
    //     });

    await Friend.destroy({ where: { user_email: deleteEmail[0], friend_email: deleteEmail[1] } })
        .then(async (result) => {
            await Friend.destroy({ where: { user_email: deleteEmail[1], friend_email: deleteEmail[0] } })
                .then((result) => {
                    Logger.info(`Success! ${result}`);
                    callback(null, 'DELETE FRIEND OK');
                })
                .catch((err) => {
                    Logger.error(err);
                    return callback(err);
                });
        })
        .catch((err) => {
            Logger.error(err);
            return callback(err);
        });
};

export default { getFriendList, deleteFriend };
