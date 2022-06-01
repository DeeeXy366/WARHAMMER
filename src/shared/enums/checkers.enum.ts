export const checkers = {
    slither:
        'docker run -a stdin -a stderr -a stdout --rm --entrypoint="" -v `pwd`:/home/ethsec/contracts trailofbits/eth-security-toolbox slither ./contracts/loadedContracts/{file} --disable-color --print human-summary',
    // myth: 'docker run --rm -v `pwd`:/tmp mythril/myth a /tmp/{file} -t 1',
}
// todo slither manticore ehidna myth
