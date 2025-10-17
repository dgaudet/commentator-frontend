# Enterprise Best Practices

This directory contains enterprise-grade best practices that all personas in the PDD Framework must follow.

## 📋 Available Best Practices

### Critical Priority

- **[test-driven-development.md](./test-driven-development.md)** - Mandatory TDD workflow for all development
- **[security-guidelines.md](./security-guidelines.md)** - Comprehensive security requirements and OWASP compliance
- **[security-checklist.md](./security-checklist.md)** - Security audit and validation checklist
- **[enverus-ux-guidelines.md](./enverus-ux-guidelines.md)** - Enverus UI/UX design standards and principles

### High Priority

- **[code-review-guidelines.md](./code-review-guidelines.md)** - Code review standards for all personas
- **[performance-standards.md](./performance-standards.md)** - Performance requirements and optimization standards

## 🎯 Purpose

These best practices documents:

1. **Define Standards**: Establish enterprise-wide quality, security, and performance standards
2. **Guide Personas**: All personas reference and enforce applicable best practices
3. **Enable Validation**: Provide quality gates and compliance checkpoints
4. **Ensure Consistency**: Maintain consistent practices across all development teams

## 📁 Distribution

When you run `pdd init`, these best practices are automatically copied to your project:

```
your-project/
├── .pdd/
│   ├── personas/          # Persona definitions
│   ├── best-practices/    # ← These documents copied here
│   ├── generated/         # Generated context files
│   └── config/            # PDD configuration
```

## 🔗 Persona Integration

Personas reference these documents using relative paths:

```markdown
### Mandatory Best Practices Documents

1. **📋 [Test-Driven Development](../best-practices/test-driven-development.md)** (CRITICAL)
2. **🔍 [Code Review Guidelines](../best-practices/code-review-guidelines.md)** (HIGH)
3. **🛡️ [Security Guidelines](../best-practices/security-guidelines.md)** (CRITICAL)
4. **⚡ [Performance Standards](../best-practices/performance-standards.md)** (HIGH)
```

The paths work because:
- Personas live in `.pdd/personas/`
- Best practices live in `.pdd/best-practices/`
- Path `../best-practices/` navigates from personas to best practices

## ✅ Best Practices Coverage by Persona

| Persona | TDD | Code Review | Security | Performance | Enverus UX |
|---------|-----|-------------|----------|-------------|------------|
| Backend Developer | ✅ MANDATORY | ✅ HIGH | ✅ CRITICAL | ✅ HIGH | N/A |
| Frontend Developer | ✅ MANDATORY | ✅ HIGH | ✅ CRITICAL | ✅ HIGH | ✅ CRITICAL |
| Data Engineer | N/A | ✅ HIGH | ✅ CRITICAL | ✅ HIGH | N/A |
| DevOps Engineer | N/A | ✅ HIGH | ✅ CRITICAL | ✅ HIGH | N/A |
| Security Engineer | N/A | ✅ HIGH | ✅ PRIMARY | ✅ MEDIUM | N/A |
| QA Engineer | ✅ VALIDATES | ✅ HIGH | ✅ HIGH | ✅ HIGH | ✅ VALIDATES |
| System Architect | ✅ SUPPORTS | ✅ HIGH | ✅ CRITICAL | ✅ CRITICAL | ✅ GOVERNANCE |
| Product Owner | N/A | ✅ LIMITED | N/A | N/A | ✅ DEFINES |
| Business Analyst | N/A | ✅ LIMITED | N/A | N/A | ✅ REQUIREMENTS |
| Technical Writer | ✅ DOCUMENTS | ✅ HIGH | ✅ MEDIUM | N/A | ✅ DOCUMENTS |

## 🛡️ Enforcement

Best practices are enforced through:

1. **Persona Activation**: Personas acknowledge applicable best practices on activation
2. **Quality Gates**: Automated validation against best practices requirements
3. **Code Reviews**: Peer review verification of best practices compliance
4. **Authority Levels**:
   - **VETO POWER**: Security Engineer can block for security violations
   - **GOVERNANCE**: System Architect can block for architecture violations
   - **RELEASE BLOCKING**: QA Engineer can block for quality violations

## 📚 Maintenance

These documents are:

- ✅ **Version Controlled**: Commit to your repository
- ✅ **Team-Specific**: Customize for your organization's needs
- ✅ **Living Documents**: Update as practices evolve
- ✅ **Portable**: Work across all projects using PDD Framework

## 🔄 Updates

To update best practices in an existing project:

```bash
# Re-run init to update (non-destructive for existing personas)
pdd init

# Or manually copy updated best practices from:
# node_modules/@enverus/pdd-framework/packs/core-enterprise/best-practices/
```

## 📖 Related Documentation

- [User Guide](../../../docs/user-guide.md) - Complete PDD Framework documentation
- [Persona Creation Guide](../../../docs/persona-creation-guide.md) - Creating custom personas
- [Development Guide](../../../docs/development.md) - Contributing to PDD Framework

---

**Remember**: These best practices are not optional - they are enforced requirements that ensure enterprise-grade quality, security, and performance across all development work.
