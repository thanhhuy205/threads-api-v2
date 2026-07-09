

const type = ['POST', 'LIKE', 'FOLLOW', 'QUOTE', 'SHARE', 'MESSAGE', 'REPLY', 'MENTION', 'INVITATION', 'JOIN_REQUEST'];
const targetType = ['POST', 'MESSAGE_GROUP', 'RESENT_INVITATION', 'CIRCLE_JOIN_REQUEST', 'ADMIN_INVITATION'];
export const notificationCollection = {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: [
                'publicId', 'recipientId', 'type', 'targetType',
                'targetId', 'actorIds', 'count', 'isRead',
                'lastActorId', 'lastEventAt', 'createdAt', 'updatedAt'
            ],
            properties: {
                _id: { bsonType: 'objectId' },

                publicId: {
                    bsonType: 'string',
                    description: 'Unique public identifier (cuid)'
                },


                recipientId: {
                    bsonType: 'string',
                    description: 'ID người nhận thông báo'
                },

                type: {
                    enum: type,
                    description: 'Loại thông báo'
                },

                targetType: {
                    enum: targetType,
                    description: 'Loại đối tượng được tác động (post, comment...)'
                },

                targetId: {
                    bsonType: 'string',
                    description: 'ID đối tượng được tác động'
                },

                actorIds: {
                    bsonType: 'array',
                    items: { bsonType: 'string' },
                    description: 'Danh sách actor đã thực hiện hành động'
                },

                count: {
                    bsonType: 'int',
                    minimum: 1,
                    description: 'Số lần sự kiện xảy ra'
                },

                isRead: {
                    bsonType: 'bool',
                    description: 'Trạng thái đã đọc'
                },

                lastActorId: {
                    bsonType: 'string',
                    description: 'ID người thực hiện hành động gần nhất'
                },

                lastActor: {
                    object: {
                        id: { bsonType: 'string' },
                        username: { bsonType: 'string' },
                        avatar: { bsonType: 'string' }
                    },
                    description: 'Thông tin người thực hiện hành động gần nhất'
                },

                lastEventAt: {
                    bsonType: 'date',
                    description: 'Thời điểm sự kiện gần nhất'
                },

                createdAt: {
                    bsonType: 'date'
                },

                updatedAt: {
                    bsonType: 'date'
                },

                originPostId: {
                    bsonType: ['string', 'null'],
                    description: 'publicId bài gốc, tránh join khi hiển thị notification'
                }
            },

            additionalProperties: false
        }
    },
    validationLevel: 'strict',
    validationAction: 'error'
};
