export const basic_message = {
    "channel": 332,
    "id": "4bf54c10-c898-11e6-8ecb-fb7283040cc2",
    "user_name": "StreamJar",
    "user_id": 1,
    "user_roles": [
        "User",
    ],
    "user_level": 86,
    "message": {
        "message": [
            {
                "type": "text",
                "data": "test",
                "text": "test "
            },
        ],
        "meta": {}
    }
}

export const complicated_role = {
    "channel": 332,
    "id": "4bf54c10-c898-11e6-8ecb-fb7283040cc2",
    "user_name": "StreamJar",
    "user_id": 1,
    "user_roles": [
        "Owner",
        "Mod",
        "Staff",
        "ChannelEditor",
        "Subscriber",
        "User",
        "notarole"
    ],
    "user_level": 86,
    "message": {
        "message": [
            {
                "type": "text",
                "data": "test ",
                "text": "test "
            },
            {
                "type": "emoticon",
                "source": "builtin",
                "pack": "default",
                "coords": {
                    "x": 72,
                    "y": 0,
                    "width": 24,
                    "height": 24
                },
                "text": ":D"
            },
            {
                "type": "text",
                "data": " ",
                "text": " "
            },
            {
                "type": "emoticon",
                "source": "external",
                "pack": "https://google.com",
                "coords": {
                    "x": 120,
                    "y": 24,
                    "width": 24,
                    "height": 24
                },
                "text": ":("
            },
            {
                "type": "text",
                "data": " ",
                "text": " "
            },
            {
                "type": "link",
                "url": "https://google.com",
                "text": "https://google.com"
            },
            {
                "type": "text",
                "data": " ",
                "text": " "
            },
            {
                "text": "@StreamJar",
                "type": "tag",
                "username": "StreamJar",
                "id": 20742
            }
        ],
        "meta": {}
    }
}

export const jar_roles = {
    "channel": 332,
    "id": "4bf54c10-c898-11e6-8ecb-fb7283040cc2",
    "user_name": "StreamJar",
    "user_id": 2,
    "user_roles": [
        "User",
    ],
    "user_level": 86,
    "message": {
        "message": [
            {
                "type": "text",
                "data": "test",
                "text": "test "
            },
        ],
        "meta": {}
    }
}

export const bot_roles = {
    "channel": 332,
    "id": "4bf54c10-c898-11e6-8ecb-fb7283040cc2",
    "user_name": "StreamJar",
    "user_id": 3,
    "user_roles": [
        "User",
    ],
    "user_level": 86,
    "message": {
        "message": [
            {
                "type": "text",
                "data": "test",
                "text": "test "
            },
        ],
        "meta": {}
    }
}

export const command = {
    "channel": 332,
    "id": "4bf54c10-c898-11e6-8ecb-fb7283040cc2",
    "user_name": "StreamJar",
    "user_id": 1,
    "user_roles": [
        "User",
    ],
    "user_level": 86,
    "message": {
        "message": [
            {
                "type": "text",
                "data": "!give",
                "text": "!give"
            },
            {
                "text": "@Luke",
                "type": "tag",
                "username": "Luke",
                "id": 332
            }, 
        ],
        "meta": {}
    }
}

export const tag = {
    "channel": 332,
    "id": "4bf54c10-c898-11e6-8ecb-fb7283040cc2",
    "user_name": "StreamJar",
    "user_id": 1,
    "user_roles": [
        "User",
    ],
    "user_level": 86,
    "message": {
        "message": [
            {
                "text": "@StreamJar",
                "type": "tag",
                "username": "StreamJar",
                "id": 20742
            },
            {
                "type": "text",
                "data": "give",
                "text": "give"
            },
            {
                "text": "@Luke",
                "type": "tag",
                "username": "Luke",
                "id": 332
            },           
        ],
        "meta": {}
    }
}