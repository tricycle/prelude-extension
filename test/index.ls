assert = require \assert
{keys} = require \prelude-ls

# prelude-extension
{batch, clamp, find-all, get, is-empty-object, is-equal-to-object, 
mappend, partition-string, rextend, set, transpose, unwrap} = require \../index.ls

describe "prelude-extension", ->

    specify "batch", ->
        result = batch 3, [0 til 10]
        assert 4 == result.length
        assert 1 == result[result.length - 1].length

    specify "clamp", ->
        assert (clamp 1.2, 0, 1) == 1
        assert (clamp 0.2, 0.5, 1) == 0.5

    str = "hip hop hip hop"

    specify "find-all", ->
        indices = find-all str, \hip, 0
        assert indices.length == 2
        assert indices.0 == 0
        assert indices.1 == 8

    specify "get", ->
        population = asia: china: singapore: 539900
        assert (get population, <[asia china singapore]>) == 539900

    specify "is-empty-object", ->
        assert true == is-empty-object {}
        assert true == is-empty-object {x: undefined, y: undefined}
        assert false == is-empty-object {x: undefined, y: 1}

    specify "is-equal-to-object", ->
        o1 = {a: {b: 1, c: 1}, d: 2}
        o2 = {a: {b: 1, c: 1}, d: 2}
        assert o1 `is-equal-to-object` o2
        o1 = [1,2,3]
        o2 = [1,2,3]
        assert o1 `is-equal-to-object` o2
        o1 = \apple
        o2 = \apple
        assert o1 `is-equal-to-object` o2
        o1 = {a: {b: {c: 1}}}
        o2 = {a: {b: 1}}
        assert !(o1 `is-equal-to-object` o2)
        o1 = [1,2,3]
        o2 = [1,"2",3]
        assert !(o1 `is-equal-to-object` o2)
        assert (null `is-equal-to-object` null)
        assert (undefined `is-equal-to-object` undefined)
        assert true `is-equal-to-object` true
        assert false `is-equal-to-object` false
        assert !(false `is-equal-to-object` true)
        assert false == ({x: 1, y: 1, z: 1} `is-equal-to-object` {x: 1, y: 1})

    specify "mappend", ->
        stats = {users: {"40": {visits: 2}}}
        mappend stats, <[users 40]>, {visits: 1}, (a, b) -> {visits: a.visits + b.visits}
        assert stats.users["40"].visits == 3

    specify "partition-string", ->
        partitions = partition-string str, \hip
        assert partitions.length == 4

        # the first partition ([0, 3, true])
        assert partitions.0.0 == 0
        assert partitions.0.1 == 3
        assert partitions.0.2 == true

        # the second partition ([3, 8, false])
        assert partitions.1.2 == false

        # the third partition ([8, 11, true])
        assert partitions.2.0 == 8
        assert partitions.2.1 == 11
        assert partitions.2.2 == true

    specify "rextend", ->
        obj = {a: {x: 1, y: 1}}
        result = rextend obj, {a: {x: 2}}
        assert result.a.y == 1

    specify "set", ->
        users = {"40": {address: {country: "ae"}}}
        result = set users, <[40 address country]>, \us
        assert users["40"].address.country == \us

    specify "transpose", ->
        assert (transpose [[1,2], [3,4]]) `is-equal-to-object` [[1,3], [2,4]]

    specify "unwrap", ->
        stats = 
            \17031 :
                \com.test.app1 :
                    \football :
                        visits: 100
                        subs: 5
                \com.test.app2 :
                    \selfie :
                        visits: 200
                        subs: 20
            \16013 :
                \com.test.app3 :
                    \halloween : 
                        visits: 150
                        subs: 12

        result = stats |> unwrap do 
            ([campaign, app, page], {visits, subs}) -> {campaign, app, page, visits, subs}
            2

        assert result.length == 3
        assert (keys result.0).length == 5
        assert (keys result.1).length == 5
