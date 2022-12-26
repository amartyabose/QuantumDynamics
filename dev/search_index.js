var documenterSearchIndex = {"docs":
[{"location":"tutorial/BasicPI/#Numerically-Exact-Path-Integral-Approaches","page":"Path Integrals","title":"Numerically Exact Path Integral Approaches","text":"","category":"section"},{"location":"tutorial/BasicPI/","page":"Path Integrals","title":"Path Integrals","text":"The family of methods based on Quasi-Adiabatic Propagator Path Integral (QuAPI) is a family of numerically exact non-perturbative techniques for simulating a quantum system interacting with a harmonic environment. It simulates the reduced density matrix of an n-level quantum system using path integrals and the harmonic bath is incorporated through the Feynman-Vernon influence functional. The tracing out of the harmonic bath leads to a non-Markovian memory, which is used as a convergence parameter.","category":"page"},{"location":"tutorial/BasicPI/","page":"Path Integrals","title":"Path Integrals","text":"The most common prototypical model problem of open quantum systems is the spin-boson problem. We will illustrate the approach taken by QuantumDynamics to make the various methods compatible with each other by demonstrating how the same basic setup works for all the basic methods.","category":"page"},{"location":"tutorial/BasicPI/","page":"Path Integrals","title":"Path Integrals","text":"The basic steps involved for these simulations are","category":"page"},{"location":"tutorial/BasicPI/","page":"Path Integrals","title":"Path Integrals","text":"Define the system\nDefine the Hamiltonian\nDefine the spectral density corresponding to the solvent\nSpecify the temperature\nObtain the short-time propagators that are used to construct the path integral\nBuild on top of the short-time propagators using the Feynman-Vernon influence functional.","category":"page"},{"location":"tutorial/BasicPI/#Example","page":"Path Integrals","title":"Example","text":"","category":"section"},{"location":"tutorial/BasicPI/","page":"Path Integrals","title":"Path Integrals","text":"using QuantumDynamics\nusing Plots, LaTeXStrings\n\nH0 = [0.0+0.0im -1.0; -1.0 0.0]   # 1.1 Define the system Hamiltonian\nJw = SpectralDensities.ExponentialCutoff(; ξ=0.1, ωc=7.5)    # 1.2 Define the spectral density\nβ = 5.0    # 1.3 Inverse temperature\nnothing","category":"page"},{"location":"tutorial/BasicPI/","page":"Path Integrals","title":"Path Integrals","text":"Let us plot the spectral density:","category":"page"},{"location":"tutorial/BasicPI/","page":"Path Integrals","title":"Path Integrals","text":"ω = 0:0.1:100\nplot(ω, Jw.(ω), lw=2, label=\"\")\nxlabel!(L\"\\omega\")\nylabel!(L\"J(\\omega)\")","category":"page"},{"location":"tutorial/BasicPI/","page":"Path Integrals","title":"Path Integrals","text":"Next, we calculate the short-time forward-backward propagators, which require us to define the time-step and number of steps of simulation.","category":"page"},{"location":"tutorial/BasicPI/","page":"Path Integrals","title":"Path Integrals","text":"dt = 0.25\nntimes = 100\nfbU = Propagators.calculate_bare_propagators(; Hamiltonian=H0, dt=dt, ntimes=ntimes)\nnothing # suppress output","category":"page"},{"location":"tutorial/BasicPI/","page":"Path Integrals","title":"Path Integrals","text":"Finally, the methods incorporate the influence functional on top of the propagator. Here, we demonstrate the basic QuAPI algorithm at different memory lengths, kmax.","category":"page"},{"location":"tutorial/BasicPI/","page":"Path Integrals","title":"Path Integrals","text":"ρ0 = [1.0+0.0im 0; 0 0]\nsigma_z = []\nkmax = 1:2:9\ntime = Vector{Float64}()\nfor k in kmax\n    @time t, ρs = QuAPI.propagate(; fbU=fbU, Jw=[Jw], β=β, ρ0=ρ0, dt=dt, ntimes=ntimes, kmax=k)\n    global time = t\n    push!(sigma_z, real.(ρs[:,1,1] .- ρs[:,2,2]))\nend","category":"page"},{"location":"tutorial/BasicPI/","page":"Path Integrals","title":"Path Integrals","text":"colors = [\"red\" \"green\" \"blue\" \"teal\" \"magenta\"]\nplot(time, sigma_z, lw=2, label=permutedims([L\"k = %$k\" for k in kmax]), seriescolor=colors)\nxlabel!(L\"t\")\nylabel!(L\"\\langle\\sigma_z(t)\\rangle\")","category":"page"},{"location":"tutorial/BasicPI/","page":"Path Integrals","title":"Path Integrals","text":"Since the iteration regime can be quite costly, we have implemented an extension to the non-Markovian transfer tensor method (TTM) which is compatible with the QuAPI scheme. This is invoked in the following manner:","category":"page"},{"location":"tutorial/BasicPI/","page":"Path Integrals","title":"Path Integrals","text":"ρ0 = [1.0+0.0im 0; 0 0]\nsigma_z = []\nrmax = 1:2:9\ntime = Vector{Float64}()\nfor r in rmax\n    @time t, ρs = TTM.propagate(; fbU=fbU, Jw=[Jw], β=β, ρ0=ρ0, dt=dt, ntimes=ntimes, rmax=r, build_propagator=QuAPI.build_augmented_propagator)\n    global time = t\n    push!(sigma_z, real.(ρs[:,1,1] .- ρs[:,2,2]))\nend","category":"page"},{"location":"tutorial/BasicPI/","page":"Path Integrals","title":"Path Integrals","text":"The TTM.propagate method, in addition to the usual arguments, takes a function to build the initial propagators for the full-path regime of the simulation. In this case, we are using QuAPI to build the propagators in the full-path segment, as indicated by build_propagator=QuAPI.build_augmented_propagator.","category":"page"},{"location":"tutorial/BasicPI/","page":"Path Integrals","title":"Path Integrals","text":"colors = [\"red\" \"green\" \"blue\" \"teal\" \"magenta\"]\nplot(time, sigma_z, lw=2, label=permutedims([L\"k = %$r\" for r in rmax]), seriescolor=colors)\nxlabel!(L\"t\")\nylabel!(L\"\\langle\\sigma_z(t)\\rangle\")","category":"page"},{"location":"tutorial/BasicPI/","page":"Path Integrals","title":"Path Integrals","text":"TTM can also use the so-called blip-decomposed propagators where the augmented propagators are calculated using blip-decomposed path integrals. The code remains practically identical, except the build_propagator argument changes from QuAPI.build_augmented_propagator to Blip.build_augmented_propagator.","category":"page"},{"location":"tutorial/BasicPI/","page":"Path Integrals","title":"Path Integrals","text":"ρ0 = [1.0+0.0im 0; 0 0]\nsigma_z = []\nrmax = 1:2:9\ntime = Vector{Float64}()\nfor r in rmax\n    @time t, ρs = TTM.propagate(; fbU=fbU, Jw=[Jw], β=β, ρ0=ρ0, dt=dt, ntimes=ntimes, rmax=r, build_propagator=Blip.build_augmented_propagator)\n    global time = t\n    push!(sigma_z, real.(ρs[:,1,1] .- ρs[:,2,2]))\nend","category":"page"},{"location":"tutorial/BasicPI/","page":"Path Integrals","title":"Path Integrals","text":"colors = [\"red\" \"green\" \"blue\" \"teal\" \"magenta\"]\nplot(time, sigma_z, lw=2, label=permutedims([L\"k = %$r\" for r in rmax]), seriescolor=colors)\nxlabel!(L\"t\")\nylabel!(L\"\\langle\\sigma_z(t)\\rangle\")","category":"page"},{"location":"documentation/SpectralDensities/#Spectral-Densities","page":"Spectral Densities","title":"Spectral Densities","text":"","category":"section"},{"location":"documentation/SpectralDensities/","page":"Spectral Densities","title":"Spectral Densities","text":"The interaction of a quantum system with a condensed phase environment is often captured through the spectral density. QuantumDynamics has a built-in support for a few of the most common spectral densities and allows for easy incorporation of other spectral densities.","category":"page"},{"location":"documentation/SpectralDensities/#API","page":"Spectral Densities","title":"API","text":"","category":"section"},{"location":"documentation/SpectralDensities/","page":"Spectral Densities","title":"Spectral Densities","text":"SpectralDensities","category":"page"},{"location":"documentation/SpectralDensities/#QuantumDynamics.SpectralDensities","page":"Spectral Densities","title":"QuantumDynamics.SpectralDensities","text":"Collection of spectral densities commonly used to describe solvents.\n\n\n\n\n\n","category":"module"},{"location":"documentation/SpectralDensities/","page":"Spectral Densities","title":"Spectral Densities","text":"SpectralDensities.ExponentialCutoff","category":"page"},{"location":"documentation/SpectralDensities/#QuantumDynamics.SpectralDensities.ExponentialCutoff","page":"Spectral Densities","title":"QuantumDynamics.SpectralDensities.ExponentialCutoff","text":"ExponentialCutoff(; ξ, ωc, n=1.0, Δs=2.0)\n\nConstruct a model spectral density with an exponential cutoff.\n\nJ(ω) = frac2πΔs^2 ξ fracω^nω_c^n-1 expleft(-fracωωcright)\n\nwhere Δs is the distance between the two system states. The model is Ohmic if n = 1, sub-Ohmic if n < 1, and super-Ohmic if n > 1.\n\n\n\n\n\n","category":"type"},{"location":"documentation/SpectralDensities/","page":"Spectral Densities","title":"Spectral Densities","text":"SpectralDensities.DrudeLorentzCutoff","category":"page"},{"location":"documentation/SpectralDensities/#QuantumDynamics.SpectralDensities.DrudeLorentzCutoff","page":"Spectral Densities","title":"QuantumDynamics.SpectralDensities.DrudeLorentzCutoff","text":"DrudeLorentzCutoff(; λ, γ, n=1.0, Δs=2.0)\n\nConstruct a model spectral density with a Drude-Lorentz cutoff.\n\nJ(ω) = frac2λΔs^2 fracω^n γ^2-nω^2 + γ^2\n\nwhere Δs is the distance between the two system states. The model is Ohmic if n = 1, sub-Ohmic if n < 1, and super-Ohmic if n > 1.\n\n\n\n\n\n","category":"type"},{"location":"documentation/Bare/#Bare-System-Propagation","page":"Bare System Propagation","title":"Bare System Propagation","text":"","category":"section"},{"location":"documentation/Bare/#API","page":"Bare System Propagation","title":"API","text":"","category":"section"},{"location":"documentation/Bare/","page":"Bare System Propagation","title":"Bare System Propagation","text":"Bare.propagate","category":"page"},{"location":"documentation/Bare/#QuantumDynamics.Bare.propagate","page":"Bare System Propagation","title":"QuantumDynamics.Bare.propagate","text":"propagate(; Hamiltonian::Matrix{ComplexF64}, ρ0::Matrix{ComplexF64}, dt::Real, ntimes::Int)\n\nGiven a potentially non-Hermitian Hamiltonian, this solves the equation of motion to propagate the input initial reduced density matrix, ρ0, with a time-step of dt for ntimes time steps.\n\n\n\n\n\n","category":"function"},{"location":"tutorial/ExternalFieldDynamics/#Dynamics-in-presence-of-an-external-light","page":"Dynamics under External Fields","title":"Dynamics in presence of an external light","text":"","category":"section"},{"location":"tutorial/ExternalFieldDynamics/","page":"Dynamics under External Fields","title":"Dynamics under External Fields","text":"It has been shown that dissipative tunneling dynamics can be controlled by continuous wave light. We replicate some of the results here. ","category":"page"},{"location":"tutorial/ExternalFieldDynamics/","page":"Dynamics under External Fields","title":"Dynamics under External Fields","text":"As usual, first, we set up the system:","category":"page"},{"location":"tutorial/ExternalFieldDynamics/","page":"Dynamics under External Fields","title":"Dynamics under External Fields","text":"using QuantumDynamics\nusing Plots, LaTeXStrings\n\nH0 = [0.0+0.0im -1.0; -1.0 0.0]   # 1.1 Define the system Hamiltonian\nV(t) = 11.96575 * cos(10.0 * t)   # This is the monochromatic light\nJw = SpectralDensities.ExponentialCutoff(; ξ=0.16, ωc=7.5)    # 1.2 Define the spectral density\nβ = 0.5    # 1.3 Inverse temperature\nnothing","category":"page"},{"location":"tutorial/ExternalFieldDynamics/","page":"Dynamics under External Fields","title":"Dynamics under External Fields","text":"Calculate the forward-backward propagators. For the case with the external field, we use the Propagators.calculate_bare_propagators_external_field function.","category":"page"},{"location":"tutorial/ExternalFieldDynamics/","page":"Dynamics under External Fields","title":"Dynamics under External Fields","text":"dt = 0.125\nntimes = 100\nfbU = Propagators.calculate_bare_propagators_external_field(; Hamiltonian=H0, dt=dt, ntimes=ntimes, external_field=[V], coupling_ops=[[1.0 0.0; 0.0 -1.0]])\nnofield_fbU = Propagators.calculate_bare_propagators(; Hamiltonian=H0, dt=dt, ntimes=ntimes)\nnothing # suppress output","category":"page"},{"location":"tutorial/ExternalFieldDynamics/","page":"Dynamics under External Fields","title":"Dynamics under External Fields","text":"Simulate the system with the field. TTM does not yet work with time-dependent Hamiltonians. So, we resort to plain QuAPI.","category":"page"},{"location":"tutorial/ExternalFieldDynamics/","page":"Dynamics under External Fields","title":"Dynamics under External Fields","text":"ρ0 = [1.0+0.0im 0; 0 0]\nsigma_z = []\nkmax = 1:2:9\ntime = Vector{Float64}()\nfor k in kmax\n    @time t, ρs = QuAPI.propagate(; fbU=fbU, Jw=[Jw], β=β, ρ0=ρ0, dt=dt, ntimes=ntimes, kmax=k)\n    global time = t\n    push!(sigma_z, real.(ρs[:,1,1] .- ρs[:,2,2]))\nend","category":"page"},{"location":"tutorial/ExternalFieldDynamics/","page":"Dynamics under External Fields","title":"Dynamics under External Fields","text":"Use TTM to simulate the case without the external field.","category":"page"},{"location":"tutorial/ExternalFieldDynamics/","page":"Dynamics under External Fields","title":"Dynamics under External Fields","text":"sigma_z_nofield = []\nkmax = 1:2:9\ntime = Vector{Float64}()\nfor k in kmax\n    @time t, ρs = TTM.propagate(; fbU=nofield_fbU, Jw=[Jw], β=β, ρ0=ρ0, dt=dt, ntimes=ntimes, rmax=k, build_propagator=QuAPI.build_augmented_propagator)\n    global time = t\n    push!(sigma_z_nofield, real.(ρs[:,1,1] .- ρs[:,2,2]))\nend","category":"page"},{"location":"tutorial/ExternalFieldDynamics/","page":"Dynamics under External Fields","title":"Dynamics under External Fields","text":"Obtain the Markovian dynamics in presence of light but in absence of the dissipative medium. ","category":"page"},{"location":"tutorial/ExternalFieldDynamics/","page":"Dynamics under External Fields","title":"Dynamics under External Fields","text":"ρs_nodissip = TTM.propagate_using_propagators(; propagators=fbU, ρ0=ρ0, ntimes=ntimes)\nnothing","category":"page"},{"location":"tutorial/ExternalFieldDynamics/","page":"Dynamics under External Fields","title":"Dynamics under External Fields","text":"Plot the results.","category":"page"},{"location":"tutorial/ExternalFieldDynamics/","page":"Dynamics under External Fields","title":"Dynamics under External Fields","text":"colors = [\"red\" \"green\" \"blue\" \"teal\" \"magenta\"]\nplot(time, sigma_z, lw=2, label=permutedims([\"Light k = $k\" for k in kmax]), seriescolor=colors)\nplot!(time, sigma_z_nofield, lw=2, ls=:dash, label=permutedims([\"No light r = $k\" for k in kmax]), seriescolor=colors)\nplot!(time, real.(ρs_nodissip[:,1,1] .- ρs_nodissip[:,2,2]), lw=2, label=\"No dissipation\")\nxlabel!(L\"t\")\nylabel!(L\"\\langle\\sigma_z(t)\\rangle\")","category":"page"},{"location":"tutorial/ExternalFieldDynamics/","page":"Dynamics under External Fields","title":"Dynamics under External Fields","text":"The localization phenomenon, though not as pronounced as in absence of dissipative media, is still clearly visible. As a comparison, we also simulate the dynamics in presence of a light pulse","category":"page"},{"location":"tutorial/ExternalFieldDynamics/","page":"Dynamics under External Fields","title":"Dynamics under External Fields","text":"V1(t) = 11.96575 * cos(10.0 * t) * exp(-t^2 / 8)   # This is the light pulse\nfbU_pulse = Propagators.calculate_bare_propagators_external_field(; Hamiltonian=H0, dt=dt, ntimes=ntimes, external_field=[V1], coupling_ops=[[1.0 0.0; 0.0 -1.0]])\nkmax = 1:2:9\n@time time, ρs = QuAPI.propagate(; fbU=fbU_pulse, Jw=[Jw], β=β, ρ0=ρ0, dt=dt, ntimes=ntimes, kmax=9)\nsigma_z_pulse = real.(ρs[:,1,1] .- ρs[:,2,2])\nnothing","category":"page"},{"location":"tutorial/ExternalFieldDynamics/","page":"Dynamics under External Fields","title":"Dynamics under External Fields","text":"Plot the results.","category":"page"},{"location":"tutorial/ExternalFieldDynamics/","page":"Dynamics under External Fields","title":"Dynamics under External Fields","text":"colors = [\"black\"]\nplot(time, sigma_z[end], lw=2, label=\"CW k = $(kmax[end])\", seriescolor=colors)\nplot!(time, sigma_z_pulse, lw=2, ls=:dash, label=\"Pulse k = 9\", seriescolor=colors)\nxlabel!(L\"t\")\nylabel!(L\"\\langle\\sigma_z(t)\\rangle\")","category":"page"},{"location":"tutorial/Bloch-Redfield/#Bloch-Redfield-Master-Equation","page":"Bloch-Redfield Master Equation","title":"Bloch-Redfield Master Equation","text":"","category":"section"},{"location":"tutorial/Bloch-Redfield/","page":"Bloch-Redfield Master Equation","title":"Bloch-Redfield Master Equation","text":"QuantumDynamics also offers the option of simulating the dynamics of an open quantum system using the Bloch-Redfield equations. The main interface is similar to that of the path integral-based methods except for the crucial difference that instead of building on the forward-backward propagator, the Bloch-Redfield Master Equations (BRME) uses the Hamiltonian.","category":"page"},{"location":"tutorial/Bloch-Redfield/","page":"Bloch-Redfield Master Equation","title":"Bloch-Redfield Master Equation","text":"First, we define the system and the spectral density describing the solvent","category":"page"},{"location":"tutorial/Bloch-Redfield/","page":"Bloch-Redfield Master Equation","title":"Bloch-Redfield Master Equation","text":"using QuantumDynamics\nusing Plots, LaTeXStrings\n\nH0 = [0.0+0.0im -1.0; -1.0 0.0]   # 1.1 Define the system Hamiltonian\nJw = SpectralDensities.ExponentialCutoff(; ξ=0.1, ωc=7.5)    # 1.2 Define the spectral density\nβ = 5.0    # 1.3 Inverse temperature\ndt = 0.25\nntimes = 100\nρ0 = [1.0+0.0im 0; 0 0]\nnothing","category":"page"},{"location":"tutorial/Bloch-Redfield/","page":"Bloch-Redfield Master Equation","title":"Bloch-Redfield Master Equation","text":"The interface to BRME is provided in the Bloch-Redfield module as the propagate function.","category":"page"},{"location":"tutorial/Bloch-Redfield/","page":"Bloch-Redfield Master Equation","title":"Bloch-Redfield Master Equation","text":"time, ρs = BlochRedfield.propagate(; Hamiltonian=H0, Jw=[Jw], β, ρ0, dt, ntimes, svec=[[1.0 0.0; 0.0 -1.0]])\nnothing","category":"page"},{"location":"tutorial/Bloch-Redfield/","page":"Bloch-Redfield Master Equation","title":"Bloch-Redfield Master Equation","text":"Let's also do a QuAPI calculation for comparison:","category":"page"},{"location":"tutorial/Bloch-Redfield/","page":"Bloch-Redfield Master Equation","title":"Bloch-Redfield Master Equation","text":"fbU = Propagators.calculate_bare_propagators(; Hamiltonian=H0, dt=dt, ntimes=ntimes)\nt, ρs_quapi = QuAPI.propagate(; fbU=fbU, Jw=[Jw], β=β, ρ0=ρ0, dt=dt, ntimes=ntimes, kmax=7)\nnothing","category":"page"},{"location":"tutorial/Bloch-Redfield/","page":"Bloch-Redfield Master Equation","title":"Bloch-Redfield Master Equation","text":"plot(t, real.(ρs_quapi[:,1,1] .- ρs_quapi[:,2,2]), lw=2, label=\"QuAPI\")\nplot!(time, real.(ρs[:,1,1] .- ρs[:,2,2]), lw=2, label=\"BRME\")\nxlabel!(L\"t\")\nylabel!(L\"\\langle\\sigma_z(t)\\rangle\")","category":"page"},{"location":"documentation/EtaCoefficients/#η-Coefficients","page":"Eta Coefficients","title":"η-Coefficients","text":"","category":"section"},{"location":"documentation/EtaCoefficients/","page":"Eta Coefficients","title":"Eta Coefficients","text":"The η-coefficients are discretizations of the bath correlation function required for simulations using the QuAPI influence functionals. QuantumDynamics provides facilities for generating these coefficients and storing them in a way that utilizes the limited time-translational symmetry that they demonstrate. ","category":"page"},{"location":"documentation/EtaCoefficients/#API","page":"Eta Coefficients","title":"API","text":"","category":"section"},{"location":"documentation/EtaCoefficients/","page":"Eta Coefficients","title":"Eta Coefficients","text":"EtaCoefficients.EtaCoeffs","category":"page"},{"location":"documentation/EtaCoefficients/#QuantumDynamics.EtaCoefficients.EtaCoeffs","page":"Eta Coefficients","title":"QuantumDynamics.EtaCoefficients.EtaCoeffs","text":"EtaCoefficients holds the various discretized η-coefficients required for a QuAPI-based simulation. These are the minimum number of coefficients required, stored using time-translational symmetry wherever possible.\n\nThe values are stored as follows:\n    η00: The self-interaction of the two terminal time points.\n    ηmm: The self-interaction of all intermediate points.\n    η0m: The interaction between a terminal and an intermediate point at different time separations.\n    ηmn: The interaction between two intermediate points at different time separations.\n    η0e: The interaction between the two terminal points at different time separations.\n\n\n\n\n\n","category":"type"},{"location":"documentation/EtaCoefficients/","page":"Eta Coefficients","title":"Eta Coefficients","text":"EtaCoefficients.calculate_η","category":"page"},{"location":"documentation/EtaCoefficients/#QuantumDynamics.EtaCoefficients.calculate_η","page":"Eta Coefficients","title":"QuantumDynamics.EtaCoefficients.calculate_η","text":"calculate_η(specdens<:SpectralDensities.AnalyticalSpectralDensity; β::Real, dt::Real, kmax::Int, classical::Bool=false, discrete::Bool=false)\n\nCalculates the η-coefficients from an analytic spectral density and returns them as an object of the structure EtaCoeffs. The integrations involved are done using trapezoidal integration\n\n\n\n\n\ncalculate_η(specdens<:SpectralDensities.TabularSpectralDensity; β::Real, dt::Real, kmax::Int, classical::Bool=false, discrete::Bool=false)\n\nCalculates the η-coefficients from a discretized set of harmonic modes and returns them as an object of the structure EtaCoeffs. The integrations involved are converted to sums over frequency modes.\n\n\n\n\n\ncalculate_η(specdens<:SpectralDensities.TabularSpectralDensity; β::Real, dt::Real, kmax::Int, classical::Bool=false, discrete::Bool=false)\n\nCalculates the η-coefficients from a discretized set of harmonic modes and returns them as an object of the structure EtaCoeffs. The integrations involved are converted to sums over frequency modes.\n\n\n\n\n\n","category":"function"},{"location":"#Quantum-Dynamics","page":"Introduction","title":"Quantum Dynamics","text":"","category":"section"},{"location":"","page":"Introduction","title":"Introduction","text":"Documentation\n[![docs-dev][docsdev-img]][docsdev-url]","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"[docsdev-img]: https://img.shields.io/badge/docs-dev-blue.svg [docsdev-url]: https://amartyabose.github.io/QuantumDynamics/dev/","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"QuantumDynamics is an open-source software for the simulation of open quantum systems. Though written with performance in mind, QuantumDynamics provides a high throughput platform for experimentation with state-of-the-art approaches to method development.","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"The primary problem that QuantumDynamics is aimed at solving is simulation of the dynamics of a relatively small quantum system coupled to a dissipative environment. Such a system-solvent decomposed problem can typically be represented by the Hamiltonian:","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"hatH = hatH_0 + hatH_textenv","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"where hatH_0 is the Hamiltonian of the isolated system and hatH_textenv is the Hamiltonian corresponding to the environment and the interaction between the system and the environment.","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"Under Gaussian response theory, a molecular solvent can be mapped to a bath of harmonic oscillators bi-linearly interacting with the system:","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"hatH_textenv = sum_j fracp_j^22 + frac12omega_j^2left(x_j - fracc_jomega_j^2hatsright)^2","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"where hats is the system operator that couples with the bath modes. In such a harmonic mapping, the frequencies, omega_j and the couplings c_j are characterized by the spectral density, which is related to the energy-gap autocorrelation function of the molecular solvent.","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"J(omega) = fracpi2 sum_j fracc_j^2omega_jdeltaleft(omega-omega_jright)","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"The simulations aim at computing the reduced density matrix corresponding to the system. The tracing out of the environment modes leads to temporally non-local interactions and non-Markovian dynamics. The non-Markovian interactions can be computed using the Feynman-Vernon influence functional, which when discretized give rise to the eta-coefficients used in this package.","category":"page"},{"location":"#Installation","page":"Introduction","title":"Installation","text":"","category":"section"},{"location":"","page":"Introduction","title":"Introduction","text":"The QuantumDynamics package has not yet been registered. For the time being, the installation procedure directly uses the github repository. This can either be done by going into the package manager mode for Julia","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"~ julia","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"julia> ]\npkg> add https://github.com/amartyabose/QuantumDynamics","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"or by using the Pkg package manager in a script:","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"julia> using Pkg\njulia> Pkg.add(\"https://github.com/amartyabose/QuantumDynamics\")","category":"page"},{"location":"documentation/Blip/#Blip-decomposition-of-the-path-integral","page":"Blip Decomposition","title":"Blip decomposition of the path integral","text":"","category":"section"},{"location":"documentation/Blip/#API","page":"Blip Decomposition","title":"API","text":"","category":"section"},{"location":"documentation/Blip/","page":"Blip Decomposition","title":"Blip Decomposition","text":"Blip.build_augmented_propagator","category":"page"},{"location":"documentation/Blip/#QuantumDynamics.Blip.build_augmented_propagator","page":"Blip Decomposition","title":"QuantumDynamics.Blip.build_augmented_propagator","text":"build_augmented_propagator(; fbU::Matrix{ComplexF64}, Jw::Vector{T}, β::Real, dt::Real, ntimes::Int, cutoff=-1, svec=[1.0 -1.0], reference_prop=false, verbose::Bool=false) where {T<:SpectralDensities.SpectralDensity}\n\nBuilds the propagators, augmented with the influence of the harmonic baths defined by the spectral densities Jw,  upto ntimes time-steps without iteration using the blip decomposition. The paths are, consequently, generated in the space of unique blips and not stored. So, while the space requirement is minimal and constant, the time complexity for each time-step grows by an additional factor of b, where b is the number of unique blip-values. This i^th bath, described by Jw[i], interacts with the system through the diagonal operator with the values of svec[j,:].\n\n\n\n\n\n","category":"function"},{"location":"documentation/QuAPI/#Quasi-Adiabatic-Propagator-Path-Integral","page":"QuAPI","title":"Quasi-Adiabatic Propagator Path Integral","text":"","category":"section"},{"location":"documentation/QuAPI/","page":"QuAPI","title":"QuAPI","text":"This module provides the basic interface for simulating a system using QuAPI.","category":"page"},{"location":"documentation/QuAPI/#API","page":"QuAPI","title":"API","text":"","category":"section"},{"location":"documentation/QuAPI/","page":"QuAPI","title":"QuAPI","text":"QuAPI.propagate","category":"page"},{"location":"documentation/QuAPI/#QuantumDynamics.QuAPI.propagate","page":"QuAPI","title":"QuantumDynamics.QuAPI.propagate","text":"propagate(; fbU::Matrix{ComplexF64}, Jw::Vector{T}, β::Real, ρ0, dt::Real, ntimes::Int, kmax::Int, cutoff=0.0, svec=[1.0 -1.0], reference_prop=false, verbose::Bool=false) where {T<:SpectralDensities.SpectralDensity}\n\nGiven a system forward-backward propagator, fbU, the spectral densities describing the solvent, Jw, and an inverse temperature, this uses QuAPI to propagate the input initial reduced density matrix, ρ0, with a time-step of dt for ntimes time steps. A non-Markovian memory of kmax steps is used in this simulation. This i^th bath, described by Jw[i], interacts with the system through the diagonal operator with the values of svec[j,:].\n\n\n\n\n\n","category":"function"},{"location":"documentation/QuAPI/","page":"QuAPI","title":"QuAPI","text":"QuAPI.build_augmented_propagator","category":"page"},{"location":"documentation/QuAPI/#QuantumDynamics.QuAPI.build_augmented_propagator","page":"QuAPI","title":"QuantumDynamics.QuAPI.build_augmented_propagator","text":"build_augmented_propagator(; fbU::Matrix{ComplexF64}, Jw::Vector{T}, β::Real, dt::Real, ntimes::Int, cutoff=0.0, svec=[1.0 -1.0], reference_prop=false, verbose::Bool=false) where {T<:SpectralDensities.SpectralDensity}\n\nBuilds the propagators, augmented with the influence of the harmonic baths defined by the spectral densities Jw,  upto ntimes time-steps without iteration. The paths are generated in full forward-backward space but not stored. So, while the space requirement is minimal and constant, the time complexity for each time-step grows by an additional factor of d^2, where d is the dimensionality of the system. This i^th bath, described by Jw[i], interacts with the system through the diagonal operator with the values of svec[j,:].\n\n\n\n\n\n","category":"function"}]
}
