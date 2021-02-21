package main

import org.koin.dsl.module
import utils.DefaultConfig
import utils.IConfig

val localModule = module {
    single<IConfig> {
        DefaultConfig()
    }
}