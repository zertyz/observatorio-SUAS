-- lê 2 linhas a fim de identificar o texto das perguntas e a que "bloco" elas pertencem

linha_blocos    = io.read('l')
linha_perguntas = io.read('l')

function split(line)
	local list = {}
	line:gsub("([^\t]*)\t?", function (field)
		table.insert(list, field)
	end)
	return list
end

blocos          = split(linha_blocos)
perguntasFields = split(linha_perguntas)

print("## blocos:")
for n,v in ipairs(blocos) do
	print(n, v)
end

perguntasHeader = {}
lastNonNilN = nil
print("## perguntas:")
for n,v in ipairs(perguntasFields) do
	-- remove áspas opcionais de delimitação de campo
	v = v:gsub('^("?)(.*)%1$', '%2')
	local numPergunta   = v:gsub("(.*)\\n(.*)", "%1"):gsub("[Pp]ergunta ", "")
	local textoPergunta = v:gsub("(.*)\\n(.*)", "%2")

	-- determina tipo
	if (numPergunta ~= '') then
		perguntasHeader[n] = {valueType = 'resposta', numPergunta = numPergunta, textoPergunta = textoPergunta}
		lastNonNilN = n
	else
		if (lastNonNilN == (n-1)) then
			perguntasHeader[n] = perguntasHeader[lastNonNilN]
			perguntasHeader[n].valueType = 'coloracao'
		elseif (lastNonNilN == (n-2)) then
			perguntasHeader[n] = perguntasHeader[lastNonNilN]
			perguntasHeader[n].valueType = 'regra'
		else
			assert(false, "erro ao redor da coluna "..n..": o header de perguntas é inválido")
		end
	end

	print(n, v, "{valueType: '"..perguntasHeader[n].valueType.."', numPergunta: '"..perguntasHeader[n].numPergunta.."', textoPergunta: '"..perguntasHeader[n].textoPergunta.."'}")
end

perguntas = {numPergunta, textoPergunta, regraDeColoracao}
blocos = {numBloco, nomeBloco, perguntas = {numPergunta1, numPergunta2, ...}}
questionarios = {numQuestionario, nomeQuestionario}
respostas = {numQuestionario, numPergunta, textoResposta, coloracao}
