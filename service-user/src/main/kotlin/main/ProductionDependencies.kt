package main

import org.koin.dsl.module
import utils.DefaultConfig
import utils.IConfig

val productionModule = module {
    single<IConfig> {
        DefaultConfig()
    }
}