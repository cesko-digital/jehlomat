package app

import org.koin.dsl.module
import services.places.FakeDelayedPlaces
import services.places.IPlaces
import utils.IConfig
import utils.LocalConfig

val localModule = module {
    single<IConfig> {
        LocalConfig()
    }

    single<IPlaces> {
        FakeDelayedPlaces(
            delay = 100
        )
    }
}