export class RegisterCompanyUseCase {
  constructor(
    private companyRepository: any,
    private userRepository: any,
    private hashService: any
  ) {}

  async execute(input: any) {
    const existingCompany = await this.companyRepository.findByTaxId(input.taxId);
    if (existingCompany) {
      const error = new Error('Ya existe una empresa registrada con este CIF/NIF');
      error.name = 'TaxIdAlreadyExistsError';
      throw error;
    }

    const existingUser = await this.userRepository.findByEmail(input.ownerEmail);
    if (existingUser) {
      const error = new Error('El correo electrónico ya está registrado');
      error.name = 'EmailAlreadyExistsError';
      throw error;
    }

    const hashedPassword = await this.hashService.hash(input.password);

    const company = await this.companyRepository.create({
      name: input.companyName,
      taxId: input.taxId,
      email: input.companyEmail,
    });

    await this.userRepository.create({
      name: input.ownerName,
      email: input.ownerEmail,
      password: hashedPassword,
      role: 'ADMIN',
      companyId: company.id,
    });

    return { companyId: company.id };
  }
}